#!/usr/bin/env node
// Zero-dep status page for git worktrees. Lists every worktree, its
// deterministic ports, and whether the API/Web ports are answering.
//
// Run: node scripts/worktree-dashboard.mjs   (or `make worktree-dash`)
// Listens on WORKTREE_DASH_PORT (default 4999).

import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PORT = Number(process.env.WORKTREE_DASH_PORT ?? 4999);
const PROBE_TIMEOUT_MS = 600;

// CRC32 matching POSIX `cksum` so the JS port math agrees with the bash script.
// (Same polynomial, same final length-mixing step.)
const CKSUM_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i << 24;
    for (let j = 0; j < 8; j++) {
      c = (c & 0x80000000) ? ((c << 1) >>> 0) ^ 0x04c11db7 : (c << 1) >>> 0;
    }
    t[i] = c >>> 0;
  }
  return t;
})();

function cksum(str) {
  const buf = Buffer.from(str, 'utf8');
  let crc = 0;
  for (const b of buf) {
    crc = (((crc << 8) >>> 0) ^ CKSUM_TABLE[((crc >>> 24) ^ b) & 0xff]) >>> 0;
  }
  let len = buf.length;
  while (len > 0) {
    crc = (((crc << 8) >>> 0) ^ CKSUM_TABLE[((crc >>> 24) ^ (len & 0xff)) & 0xff]) >>> 0;
    len >>>= 8;
  }
  return (~crc) >>> 0;
}

function computeOffset(branch) {
  return (cksum(branch) % 99) + 1;
}

function listWorktrees() {
  const out = execFileSync('git', ['worktree', 'list', '--porcelain'], { encoding: 'utf8' });
  const entries = [];
  let current = {};
  for (const line of out.split('\n')) {
    if (line === '' && current.path) {
      entries.push(current);
      current = {};
      continue;
    }
    const [k, ...rest] = line.split(' ');
    const v = rest.join(' ');
    if (k === 'worktree') current.path = v;
    else if (k === 'HEAD') current.head = v;
    else if (k === 'branch') current.branch = v.replace(/^refs\/heads\//, '');
    else if (k === 'detached') current.detached = true;
  }
  if (current.path) entries.push(current);
  return entries;
}

function readMeta(worktreePath) {
  const metaPath = join(worktreePath, '.claude', 'local', 'meta.json');
  if (!existsSync(metaPath)) return null;
  try {
    return JSON.parse(readFileSync(metaPath, 'utf8'));
  } catch {
    return null;
  }
}

async function probe(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'manual' });
    return res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

function isMainRepo(worktreePath) {
  // Main checkout has .git as a directory; linked worktrees have .git as a file.
  const gitPath = join(worktreePath, '.git');
  if (!existsSync(gitPath)) return false;
  try {
    return statSync(gitPath).isDirectory();
  } catch {
    return false;
  }
}

async function collectState() {
  const worktrees = listWorktrees();
  const rows = await Promise.all(worktrees.map(async (w) => {
    const branch = w.branch ?? (w.detached ? `(detached ${w.head?.slice(0, 7)})` : '(unknown)');
    const main = isMainRepo(w.path);
    const offset = main ? 0 : (w.branch ? computeOffset(w.branch) : null);
    const apiPort = main ? 4000 : (offset != null ? 4000 + offset : null);
    const webPort = main ? 3000 : (offset != null ? 3000 + offset : null);
    const meta = readMeta(w.path);
    const [apiUp, webUp] = await Promise.all([
      apiPort ? probe(`http://localhost:${apiPort}/health`) : Promise.resolve(false),
      webPort ? probe(`http://localhost:${webPort}/`) : Promise.resolve(false),
    ]);
    return {
      branch,
      path: w.path,
      isMain: main,
      offset,
      apiPort,
      webPort,
      db: meta?.db ?? (main ? 'rental' : null),
      pid: meta?.pid ?? null,
      startedAt: meta?.started_at ?? null,
      apiUp,
      webUp,
    };
  }));
  return { generatedAt: new Date().toISOString(), worktrees: rows };
}

const PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Worktree dashboard</title>
  <style>
    :root { color-scheme: light dark; }
    body { font: 14px/1.5 -apple-system, BlinkMacSystemFont, system-ui, sans-serif; margin: 32px; max-width: 1100px; }
    h1 { margin: 0 0 4px; font-size: 18px; }
    .sub { color: #888; font-size: 12px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent); vertical-align: top; }
    th { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: #888; }
    code { font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
    .branch { font-weight: 600; }
    .main-tag { display: inline-block; margin-left: 6px; padding: 1px 6px; border-radius: 4px; background: color-mix(in srgb, currentColor 10%, transparent); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; }
    .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .pill.up { background: #1f9d55; color: white; }
    .pill.partial { background: #d97706; color: white; }
    .pill.down { background: color-mix(in srgb, currentColor 12%, transparent); color: #888; }
    .port-link { color: inherit; text-decoration: none; }
    .port-link:hover { text-decoration: underline; }
    .port-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
    .port-dot.up { background: #1f9d55; }
    .port-dot.down { background: #888; opacity: 0.4; }
    .muted { color: #888; }
  </style>
</head>
<body>
  <h1>Worktree dashboard</h1>
  <div class="sub" id="sub">loading…</div>
  <table>
    <thead>
      <tr><th>Branch</th><th>API</th><th>Web</th><th>DB</th><th>Status</th><th>Path</th></tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>
  <script>
    function pill(apiUp, webUp) {
      if (apiUp && webUp) return '<span class="pill up">up</span>';
      if (apiUp || webUp) return '<span class="pill partial">partial</span>';
      return '<span class="pill down">down</span>';
    }
    function portCell(port, up) {
      if (!port) return '<span class="muted">—</span>';
      const cls = up ? 'up' : 'down';
      return '<span class="port-dot ' + cls + '"></span><a class="port-link" href="http://localhost:' + port + '" target="_blank"><code>' + port + '</code></a>';
    }
    async function tick() {
      try {
        const r = await fetch('/api/state', { cache: 'no-store' });
        const { generatedAt, worktrees } = await r.json();
        const tbody = document.getElementById('rows');
        tbody.innerHTML = worktrees.map(w => {
          const mainTag = w.isMain ? '<span class="main-tag">main</span>' : '';
          return '<tr>' +
            '<td><span class="branch">' + w.branch + '</span>' + mainTag + '</td>' +
            '<td>' + portCell(w.apiPort, w.apiUp) + '</td>' +
            '<td>' + portCell(w.webPort, w.webUp) + '</td>' +
            '<td>' + (w.db ? '<code>' + w.db + '</code>' : '<span class="muted">—</span>') + '</td>' +
            '<td>' + pill(w.apiUp, w.webUp) + '</td>' +
            '<td><code class="muted">' + w.path + '</code></td>' +
            '</tr>';
        }).join('');
        document.getElementById('sub').textContent = 'refreshed ' + new Date(generatedAt).toLocaleTimeString();
      } catch (e) {
        document.getElementById('sub').textContent = 'refresh failed: ' + e.message;
      }
    }
    tick();
    setInterval(tick, 2000);
  </script>
</body>
</html>`;

const server = createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url?.startsWith('/?')) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(PAGE);
      return;
    }
    if (req.url === '/api/state') {
      const state = await collectState();
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(state));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end(String(err?.stack ?? err));
  }
});

server.listen(PORT, () => {
  console.log(`worktree dashboard → http://localhost:${PORT}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
  });
}
