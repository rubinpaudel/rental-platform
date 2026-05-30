#!/usr/bin/env node
// Zero-dep status panel for git worktrees. Linear-style row list.
// Run: node scripts/worktree-dashboard.mjs   (or `make worktree-dash`)
// Listens on WORKTREE_DASH_PORT (default 4999).

import { createServer } from 'node:http';
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, existsSync, statSync, openSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.WORKTREE_DASH_PORT ?? 4999);
const PROBE_TIMEOUT_MS = 600;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const UP_SCRIPT = join(SCRIPT_DIR, 'worktree-up.sh');
const DOWN_SCRIPT = join(SCRIPT_DIR, 'worktree-down.sh');
const REMOVE_SCRIPT = join(SCRIPT_DIR, 'worktree-remove.sh');
const PENDING_TTL_MS = 90 * 1000;
const PENDING_FAIL_TTL_MS = 10 * 60 * 1000;

// path -> { action, since, pid, logPath, exitCode?, exitedAt? }
const pending = new Map();

// CRC32 matching POSIX `cksum` so the JS port math agrees with the bash script.
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

const computeOffset = (branch) => (cksum(branch) % 99) + 1;

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
  const validPaths = new Set(worktrees.map((w) => w.path));
  for (const [p, info] of pending.entries()) {
    if (!validPaths.has(p)) { pending.delete(p); continue; }
    const ttl = info.exitCode != null && info.exitCode !== 0 ? PENDING_FAIL_TTL_MS : PENDING_TTL_MS;
    if (Date.now() - info.since > ttl) pending.delete(p);
  }

  const rows = await Promise.all(worktrees.map(async (w) => {
    const branch = w.branch ?? (w.detached ? '(detached ' + (w.head?.slice(0, 7) ?? '') + ')' : '(unknown)');
    const main = isMainRepo(w.path);
    const offset = main ? 0 : (w.branch ? computeOffset(w.branch) : null);
    const apiPort = main ? 4000 : (offset != null ? 4000 + offset : null);
    const webPort = main ? 3000 : (offset != null ? 3000 + offset : null);
    const meta = readMeta(w.path);
    const [apiUp, webUp] = await Promise.all([
      apiPort ? probe('http://localhost:' + apiPort + '/health') : Promise.resolve(false),
      webPort ? probe('http://localhost:' + webPort + '/') : Promise.resolve(false),
    ]);

    // Self-clear pending when reality matches (success path).
    const p = pending.get(w.path);
    if (p && (p.exitCode == null || p.exitCode === 0)) {
      if (p.action === 'starting' && apiUp && webUp) pending.delete(w.path);
      else if (p.action === 'stopping' && !apiUp && !webUp) pending.delete(w.path);
    }

    const pendingNow = pending.get(w.path) ?? null;
    return {
      branch,
      path: w.path,
      isMain: main,
      offset,
      apiPort,
      webPort,
      db: meta?.db ?? (main ? 'rental' : null),
      startedAt: meta?.started_at ?? null,
      apiUp,
      webUp,
      pending: pendingNow ? {
        action: pendingNow.action,
        since: pendingNow.since,
        logPath: pendingNow.logPath,
        exitCode: pendingNow.exitCode ?? null,
        exitedAt: pendingNow.exitedAt ?? null,
      } : null,
    };
  }));
  return { generatedAt: new Date().toISOString(), worktrees: rows };
}

function ensureStateDir(cwd) {
  const stateDir = join(cwd, '.claude', 'local');
  try { statSync(stateDir); } catch { execFileSync('mkdir', ['-p', stateDir]); }
  return stateDir;
}

function spawnTracked(script, cwd, args, key, action) {
  const stateDir = ensureStateDir(cwd);
  const logPath = join(stateDir, 'dashboard-action.log');
  const out = openSync(logPath, 'a');
  const child = spawn('bash', [script, ...args], {
    cwd,
    detached: true,
    stdio: ['ignore', out, out],
    env: { ...process.env, WT_READY_TIMEOUT: '180' },
  });
  const since = Date.now();
  pending.set(key, { action, since, pid: child.pid, logPath, exitCode: null });
  child.on('exit', (code) => {
    const cur = pending.get(key);
    if (!cur || cur.pid !== child.pid) return;
    pending.set(key, { ...cur, exitCode: code ?? 0, exitedAt: Date.now() });
  });
  child.unref();
  return { pid: child.pid, logPath };
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleAction(req, res, action) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'text/plain' });
    res.end('method not allowed');
    return;
  }
  const body = await readBody(req);
  let parsed;
  try { parsed = JSON.parse(body); }
  catch {
    res.writeHead(400, { 'content-type': 'text/plain' });
    res.end('invalid JSON');
    return;
  }
  const requested = parsed?.path && resolve(String(parsed.path));
  if (!requested) {
    res.writeHead(400, { 'content-type': 'text/plain' });
    res.end('path required');
    return;
  }
  const worktrees = listWorktrees();
  const known = new Set(worktrees.map((w) => w.path));
  if (!known.has(requested)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('unknown worktree path');
    return;
  }
  if ((action === 'up' || action === 'remove') && isMainRepo(requested)) {
    res.writeHead(400, { 'content-type': 'text/plain' });
    res.end('cannot ' + action + ' the main repo from the dashboard');
    return;
  }

  let script, cwd, args, label;
  if (action === 'up') {
    script = UP_SCRIPT; cwd = requested; args = []; label = 'starting';
  } else if (action === 'down') {
    script = DOWN_SCRIPT; cwd = requested; args = []; label = 'stopping';
  } else {
    const mainPath = worktrees.find((w) => isMainRepo(w.path))?.path;
    if (!mainPath) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('could not locate main repo');
      return;
    }
    script = REMOVE_SCRIPT; cwd = mainPath; args = [requested]; label = 'removing';
  }
  const { pid, logPath } = spawnTracked(script, cwd, args, requested, label);
  res.writeHead(202, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true, pid, logPath }));
}

// ──────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────

const PAGE = '<!doctype html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'<title>plekje · worktrees</title>\n' +
'<style>\n' +
':root {\n' +
'  color-scheme: light dark;\n' +
'  --paper:        light-dark(oklch(1 0 0),       oklch(0.145 0 0));\n' +
'  --paper-tint:   light-dark(oklch(0.97 0 0),    oklch(0.205 0 0));\n' +
'  --ink:          light-dark(oklch(0.145 0 0),   oklch(0.985 0 0));\n' +
'  --pencil:       light-dark(oklch(0.556 0 0),   oklch(0.708 0 0));\n' +
'  --hairline:     light-dark(oklch(0.922 0 0),   oklch(0.269 0 0));\n' +
'  --ring:         light-dark(oklch(0.708 0 0),   oklch(0.556 0 0));\n' +
'  --vermilion:    oklch(0.577 0.245 27.325);\n' +
'  --vermilion-soft: oklch(0.577 0.245 27.325 / 0.12);\n' +
'}\n' +
'* { box-sizing: border-box; }\n' +
'html, body { background: var(--paper); color: var(--ink); }\n' +
'body {\n' +
'  font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;\n' +
'  margin: 0;\n' +
'  font-variant-numeric: tabular-nums;\n' +
'}\n' +
'.shell { max-width: 880px; margin: 56px auto; padding: 0 32px; }\n' +
'header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; gap: 24px; }\n' +
'.wordmark { font-size: 1.35rem; font-weight: 500; letter-spacing: 0; line-height: 1; }\n' +
'.wordmark .dim { color: var(--pencil); font-weight: 400; }\n' +
'.meta { font-size: 12px; color: var(--pencil); line-height: 1; cursor: default; }\n' +
'.meta.stale { color: var(--vermilion); cursor: pointer; }\n' +
'.meta.stale:hover { text-decoration: underline; }\n' +
'.list { display: flex; flex-direction: column; }\n' +
'.row {\n' +
'  display: grid;\n' +
'  grid-template-columns: 12px 1fr auto;\n' +
'  column-gap: 14px;\n' +
'  align-items: start;\n' +
'  padding: 16px 0;\n' +
'  border-top: 1px solid var(--hairline);\n' +
'  transition: background-color 120ms cubic-bezier(0.16, 0.84, 0.28, 1);\n' +
'}\n' +
'.row:last-child { border-bottom: 1px solid var(--hairline); }\n' +
'.row:hover { background-color: color-mix(in oklch, var(--paper-tint) 60%, transparent); }\n' +
'.row:focus-within { background-color: var(--paper-tint); }\n' +
'.row.is-failed { background-color: color-mix(in oklch, var(--vermilion-soft) 50%, transparent); }\n' +
'.dot {\n' +
'  width: 8px; height: 8px; border-radius: 50%;\n' +
'  background: var(--pencil); opacity: 0.4;\n' +
'  margin-top: 8px; justify-self: center;\n' +
'  transition: background-color 120ms, opacity 120ms;\n' +
'}\n' +
'.dot.is-up    { background: var(--ink); opacity: 1; }\n' +
'.dot.is-mixed { background: var(--ink); opacity: 0.55; }\n' +
'.dot.is-failed { background: var(--vermilion); opacity: 1; }\n' +
'.dot.is-pending {\n' +
'  background: transparent; opacity: 1;\n' +
'  border: 2px solid var(--ink);\n' +
'  border-right-color: transparent;\n' +
'  width: 10px; height: 10px; margin-top: 7px;\n' +
'  animation: spin 800ms linear infinite;\n' +
'}\n' +
'@keyframes spin { to { transform: rotate(360deg); } }\n' +
'@media (prefers-reduced-motion: reduce) {\n' +
'  .dot.is-pending { animation: none; }\n' +
'  .row { transition: none; }\n' +
'}\n' +
'.main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }\n' +
'.headline { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }\n' +
'.branch {\n' +
'  font-size: 1rem; font-weight: 500; line-height: 1.35; color: var(--ink);\n' +
'  text-decoration: none;\n' +
'}\n' +
'a.branch:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }\n' +
'a.branch:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; border-radius: 2px; }\n' +
'.tag {\n' +
'  font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;\n' +
'  color: var(--pencil); padding: 1px 6px; border: 1px solid var(--hairline); border-radius: 4px;\n' +
'}\n' +
'.metaline { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: var(--pencil); }\n' +
'.metaline .field { display: inline-flex; align-items: baseline; gap: 5px; }\n' +
'.metaline .field code { font: inherit; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--ink); user-select: all; }\n' +
'.metaline .field code.down { color: var(--pencil); text-decoration: line-through; text-decoration-thickness: 1px; }\n' +
'.metaline .field a code { color: var(--ink); }\n' +
'.metaline .field a:hover code { text-decoration: underline; }\n' +
'.metaline .field a:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; border-radius: 2px; }\n' +
'.metaline .field a { text-decoration: none; }\n' +
'.metaline .label { color: var(--pencil); }\n' +
'.failure { font-size: 12px; color: var(--vermilion); display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }\n' +
'.failure code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; user-select: all; color: var(--vermilion); }\n' +
'.actions { display: flex; gap: 6px; align-items: center; margin-top: 2px; }\n' +
'.btn {\n' +
'  font: inherit; font-size: 12px; font-weight: 500;\n' +
'  background: var(--paper); color: var(--ink);\n' +
'  border: 1px solid var(--hairline); border-radius: 10px;\n' +
'  padding: 6px 12px; cursor: pointer;\n' +
'  text-decoration: none; line-height: 1.2;\n' +
'  transition: background-color 100ms cubic-bezier(0.16, 0.84, 0.28, 1), transform 60ms;\n' +
'}\n' +
'.btn:hover:not(:disabled) { background-color: var(--paper-tint); }\n' +
'.btn:active:not(:disabled) { transform: translateY(1px); }\n' +
'.btn:focus-visible { outline: 3px solid color-mix(in oklch, var(--ring) 50%, transparent); outline-offset: 2px; }\n' +
'.btn:disabled { opacity: 0.4; cursor: not-allowed; }\n' +
'.btn.primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }\n' +
'.btn.primary:hover:not(:disabled) { background-color: color-mix(in oklch, var(--ink) 88%, var(--paper)); }\n' +
'.btn.destructive { background: var(--vermilion-soft); color: var(--vermilion); border-color: color-mix(in oklch, var(--vermilion) 30%, transparent); }\n' +
'.btn.destructive:hover:not(:disabled) { background-color: color-mix(in oklch, var(--vermilion) 22%, transparent); }\n' +
'.btn .kbd {\n' +
'  font-size: 10px; color: var(--pencil); font-weight: 400; margin-left: 6px;\n' +
'  border-left: 1px solid var(--hairline); padding-left: 6px;\n' +
'}\n' +
'.btn.primary .kbd { color: color-mix(in oklch, var(--paper) 75%, transparent); border-left-color: color-mix(in oklch, var(--paper) 30%, transparent); }\n' +
'.empty {\n' +
'  padding: 32px 0; color: var(--pencil); font-size: 14px; line-height: 1.55;\n' +
'  border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);\n' +
'}\n' +
'.empty code { background: var(--paper-tint); padding: 1px 5px; border-radius: 4px; color: var(--ink); user-select: all; }\n' +
'.hint { margin-top: 24px; font-size: 12px; color: var(--pencil); }\n' +
'.hint kbd {\n' +
'  font-family: inherit; font-size: 11px; padding: 1px 5px; border: 1px solid var(--hairline);\n' +
'  border-radius: 4px; background: var(--paper-tint); color: var(--ink);\n' +
'}\n' +
/* Modal */
'.modal-backdrop {\n' +
'  position: fixed; inset: 0; background: color-mix(in oklch, var(--ink) 30%, transparent);\n' +
'  display: flex; align-items: center; justify-content: center; padding: 24px;\n' +
'  z-index: 50;\n' +
'}\n' +
'.modal {\n' +
'  background: var(--paper); color: var(--ink);\n' +
'  border: 1px solid var(--hairline); border-radius: 14px;\n' +
'  padding: 24px; max-width: 480px; width: 100%;\n' +
'  display: flex; flex-direction: column; gap: 16px;\n' +
'}\n' +
'.modal h2 { font-size: 1rem; font-weight: 500; margin: 0; line-height: 1.35; }\n' +
'.modal p { font-size: 13px; color: var(--pencil); margin: 0; line-height: 1.55; }\n' +
'.modal p code { color: var(--ink); user-select: all; }\n' +
'.modal label { font-size: 12px; color: var(--pencil); display: flex; flex-direction: column; gap: 6px; }\n' +
'.modal input {\n' +
'  font: inherit; font-size: 14px; padding: 9px 12px;\n' +
'  background: var(--paper); color: var(--ink);\n' +
'  border: 1px solid var(--hairline); border-radius: 10px;\n' +
'  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n' +
'}\n' +
'.modal input:focus-visible {\n' +
'  outline: 3px solid color-mix(in oklch, var(--ring) 50%, transparent); outline-offset: 0;\n' +
'  border-color: var(--ring);\n' +
'}\n' +
'.modal input.match { border-color: var(--ink); }\n' +
'.modal-actions { display: flex; gap: 8px; justify-content: flex-end; }\n' +
'.focus-row .branch { box-shadow: 0 0 0 0; }\n' +
'.row.focused { background-color: var(--paper-tint); }\n' +
'.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<main class="shell">\n' +
'  <header>\n' +
'    <h1 class="wordmark">plekje <span class="dim">· worktrees</span></h1>\n' +
'    <div class="meta" id="meta" aria-live="polite" role="button" tabindex="0">loading…</div>\n' +
'  </header>\n' +
'  <div class="list" id="list" role="list"></div>\n' +
'  <div class="hint" id="hint">\n' +
'    <kbd>j</kbd> <kbd>k</kbd> navigate · <kbd>↵</kbd> open · <kbd>s</kbd> stop · <kbd>u</kbd> start · <kbd>r</kbd> remove\n' +
'  </div>\n' +
'</main>\n' +
'<div id="modal-root" aria-live="polite"></div>\n' +
'<script>\n' +
'const POLL_MS = 2000;\n' +
'let lastState = null;\n' +
'let focusIdx = 0;\n' +
'let polling = true;\n' +
'\n' +
'function esc(s) {\n' +
'  return String(s ?? "").replace(/[&<>"]/g, (c) => ({\n' +
'    "&": "&amp;", "<": "&lt;", ">": "&gt;", \'"\': "&quot;"\n' +
'  })[c]);\n' +
'}\n' +
'function attr(s) { return esc(s).replace(/\'/g, "&#39;"); }\n' +
'\n' +
'function fmtTime(iso) {\n' +
'  if (!iso) return null;\n' +
'  const d = new Date(iso);\n' +
'  return d.toLocaleTimeString([], { hour12: false });\n' +
'}\n' +
'function fmtSince(ts) {\n' +
'  const secs = Math.max(0, Math.round((Date.now() - ts) / 1000));\n' +
'  if (secs < 90) return secs + "s";\n' +
'  if (secs < 3600) return Math.round(secs / 60) + "m";\n' +
'  return Math.round(secs / 3600) + "h";\n' +
'}\n' +
'\n' +
'function dotClass(w) {\n' +
'  if (w.pending && w.pending.exitCode == null) return "dot is-pending";\n' +
'  if (w.pending && w.pending.exitCode !== 0) return "dot is-failed";\n' +
'  if (w.apiUp && w.webUp) return "dot is-up";\n' +
'  if (w.apiUp || w.webUp) return "dot is-mixed";\n' +
'  return "dot";\n' +
'}\n' +
'\n' +
'function portCell(label, port, up) {\n' +
'  if (!port) return \'<span class="field"><span class="label">\' + label + \'</span><code class="down">–</code></span>\';\n' +
'  const link = up\n' +
'    ? \'<a href="http://localhost:\' + port + \'" target="_blank" rel="noopener"><code>\' + port + \'</code></a>\'\n' +
'    : \'<code class="down">\' + port + \'</code>\';\n' +
'  return \'<span class="field"><span class="label">\' + label + \'</span>\' + link + \'</span>\';\n' +
'}\n' +
'\n' +
'function failureLine(w) {\n' +
'  const p = w.pending;\n' +
'  if (!p || p.exitCode == null || p.exitCode === 0) return "";\n' +
'  const verb = ({ starting: "start", stopping: "stop", removing: "remove" })[p.action] || p.action;\n' +
'  const logName = p.logPath ? p.logPath.split("/").pop() : "log";\n' +
'  return \'<div class="failure" role="status">\' +\n' +
'    \'<span>\' + esc(verb) + \' failed (exit \' + esc(p.exitCode) + \')</span>\' +\n' +
'    (p.logPath ? \'<a href="#" data-action="copy-log" data-log="\' + attr(p.logPath) + \'"><code>\' + esc(logName) + \'</code></a>\' : \'\') +\n' +
'  \'</div>\';\n' +
'}\n' +
'\n' +
'function actionsCell(w) {\n' +
'  const parts = [];\n' +
'  const pendingFailed = w.pending && w.pending.exitCode != null && w.pending.exitCode !== 0;\n' +
'  if (pendingFailed) {\n' +
'    const retryAction = w.pending.action === "stopping" ? "down" : w.pending.action === "removing" ? "remove" : "up";\n' +
'    parts.push(\'<button class="btn primary" data-action="\' + retryAction + \'" data-path="\' + attr(w.path) + \'" data-branch="\' + attr(w.branch) + \'">retry</button>\');\n' +
'  } else if (w.pending) {\n' +
'    // currently pending and ok so far\n' +
'    parts.push(\'<button class="btn" disabled>\' + esc(w.pending.action) + \'…</button>\');\n' +
'  } else {\n' +
'    if (w.webUp && w.webPort) {\n' +
'      parts.push(\'<a class="btn primary" href="http://localhost:\' + w.webPort + \'" target="_blank" rel="noopener" data-role="open">open<span class="kbd">↵</span></a>\');\n' +
'    }\n' +
'    if (!w.isMain) {\n' +
'      if (w.apiUp || w.webUp) {\n' +
'        parts.push(\'<button class="btn" data-action="down" data-path="\' + attr(w.path) + \'" data-branch="\' + attr(w.branch) + \'">stop<span class="kbd">s</span></button>\');\n' +
'      } else {\n' +
'        parts.push(\'<button class="btn" data-action="up" data-path="\' + attr(w.path) + \'" data-branch="\' + attr(w.branch) + \'">start<span class="kbd">u</span></button>\');\n' +
'      }\n' +
'      parts.push(\'<button class="btn destructive" data-action="remove" data-path="\' + attr(w.path) + \'" data-branch="\' + attr(w.branch) + \'">remove<span class="kbd">r</span></button>\');\n' +
'    }\n' +
'  }\n' +
'  return parts.join("");\n' +
'}\n' +
'\n' +
'function renderRow(w, idx) {\n' +
'  const focused = idx === focusIdx ? " focused" : "";\n' +
'  const failed = w.pending && w.pending.exitCode != null && w.pending.exitCode !== 0 ? " is-failed" : "";\n' +
'  const branchEl = w.webUp && w.webPort\n' +
'    ? \'<a class="branch" href="http://localhost:\' + w.webPort + \'" target="_blank" rel="noopener">\' + esc(w.branch) + \'</a>\'\n' +
'    : \'<span class="branch">\' + esc(w.branch) + \'</span>\';\n' +
'  const tag = w.isMain ? \'<span class="tag">main</span>\' : \'\';\n' +
'  const ports = portCell("api", w.apiPort, w.apiUp) + portCell("web", w.webPort, w.webUp);\n' +
'  const db = w.db ? \'<span class="field"><span class="label">db</span><code>\' + esc(w.db) + \'</code></span>\' : \'\';\n' +
'  const startedAt = w.startedAt && (w.apiUp || w.webUp) ? \'<span class="field"><span class="label">since</span><code>\' + esc(fmtTime(w.startedAt) || "") + \'</code></span>\' : \'\';\n' +
'  const pendingLine = w.pending && (w.pending.exitCode == null || w.pending.exitCode === 0)\n' +
'    ? \'<span class="field"><span class="label">\' + esc(w.pending.action) + \'</span><code>\' + fmtSince(w.pending.since) + \' ago</code></span>\'\n' +
'    : \'\';\n' +
'  return \'<div class="row\' + focused + failed + \'" role="listitem" data-path="\' + attr(w.path) + \'" data-branch="\' + attr(w.branch) + \'">\' +\n' +
'    \'<span class="\' + dotClass(w) + \'" aria-label="\' + (w.pending ? "in progress" : w.apiUp && w.webUp ? "up" : w.apiUp || w.webUp ? "partial" : "down") + \'"></span>\' +\n' +
'    \'<div class="main">\' +\n' +
'      \'<div class="headline">\' + branchEl + tag + \'</div>\' +\n' +
'      \'<div class="metaline">\' + ports + db + startedAt + pendingLine + \'</div>\' +\n' +
'      failureLine(w) +\n' +
'    \'</div>\' +\n' +
'    \'<div class="actions">\' + actionsCell(w) + \'</div>\' +\n' +
'  \'</div>\';\n' +
'}\n' +
'\n' +
'function render(state) {\n' +
'  const list = document.getElementById("list");\n' +
'  const meta = document.getElementById("meta");\n' +
'  const nonMain = state.worktrees.filter((w) => !w.isMain);\n' +
'  const rows = state.worktrees.map(renderRow).join("");\n' +
'  if (state.worktrees.length === 0) {\n' +
'    list.innerHTML = \'<div class="empty" role="status">no git worktrees registered.</div>\';\n' +
'  } else {\n' +
'    list.innerHTML = rows;\n' +
'    if (nonMain.length === 0) {\n' +
'      list.insertAdjacentHTML("beforeend", \'<div class="empty" role="status">no feature worktrees yet. run <code>make worktree-up</code> from this repo to create one.</div>\');\n' +
'    }\n' +
'  }\n' +
'  meta.classList.remove("stale");\n' +
'  const t = state.generatedAt ? new Date(state.generatedAt).toLocaleTimeString([], { hour12: false }) : "—";\n' +
'  const count = state.worktrees.length;\n' +
'  meta.textContent = "refreshed " + t + " · " + count + " worktree" + (count === 1 ? "" : "s");\n' +
'}\n' +
'\n' +
'function markStale(message) {\n' +
'  const meta = document.getElementById("meta");\n' +
'  meta.classList.add("stale");\n' +
'  meta.textContent = "stale · " + message;\n' +
'}\n' +
'\n' +
'async function tick() {\n' +
'  if (!polling) return;\n' +
'  try {\n' +
'    const r = await fetch("/api/state", { cache: "no-store" });\n' +
'    if (!r.ok) throw new Error("HTTP " + r.status);\n' +
'    const state = await r.json();\n' +
'    lastState = state;\n' +
'    if (focusIdx >= state.worktrees.length) focusIdx = Math.max(0, state.worktrees.length - 1);\n' +
'    render(state);\n' +
'  } catch (e) {\n' +
'    markStale(e.message);\n' +
'  }\n' +
'}\n' +
'\n' +
'async function callAction(action, path) {\n' +
'  const r = await fetch("/api/" + action, {\n' +
'    method: "POST",\n' +
'    headers: { "content-type": "application/json" },\n' +
'    body: JSON.stringify({ path }),\n' +
'  });\n' +
'  if (!r.ok) {\n' +
'    const txt = await r.text();\n' +
'    markStale("action failed: " + txt);\n' +
'  }\n' +
'  await tick();\n' +
'}\n' +
'\n' +
'function openRemoveModal(branch, path) {\n' +
'  const root = document.getElementById("modal-root");\n' +
'  root.innerHTML =\n' +
'    \'<div class="modal-backdrop" data-close="1">\' +\n' +
'      \'<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">\' +\n' +
'        \'<h2 id="modal-title">remove worktree</h2>\' +\n' +
'        \'<p>this stops the dev servers, drops the database, and runs <code>git worktree remove</code> on <code>\' + esc(branch) + \'</code>. the branch itself is kept.</p>\' +\n' +
'        \'<label>type <code>\' + esc(branch) + \'</code> to confirm\' +\n' +
'          \'<input id="confirm-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">\' +\n' +
'        \'</label>\' +\n' +
'        \'<div class="modal-actions">\' +\n' +
'          \'<button class="btn" data-close="1">cancel</button>\' +\n' +
'          \'<button class="btn destructive" id="confirm-btn" disabled>remove</button>\' +\n' +
'        \'</div>\' +\n' +
'      \'</div>\' +\n' +
'    \'</div>\';\n' +
'  const input = document.getElementById("confirm-input");\n' +
'  const btn = document.getElementById("confirm-btn");\n' +
'  input.focus();\n' +
'  input.addEventListener("input", () => {\n' +
'    const match = input.value === branch;\n' +
'    input.classList.toggle("match", match);\n' +
'    btn.disabled = !match;\n' +
'  });\n' +
'  input.addEventListener("keydown", (e) => {\n' +
'    if (e.key === "Enter" && !btn.disabled) { e.preventDefault(); btn.click(); }\n' +
'  });\n' +
'  btn.addEventListener("click", async () => {\n' +
'    closeModal();\n' +
'    await callAction("remove", path);\n' +
'  });\n' +
'  root.addEventListener("click", (e) => {\n' +
'    if (e.target.dataset.close === "1") closeModal();\n' +
'  });\n' +
'  document.addEventListener("keydown", escClose);\n' +
'}\n' +
'function closeModal() {\n' +
'  document.getElementById("modal-root").innerHTML = "";\n' +
'  document.removeEventListener("keydown", escClose);\n' +
'}\n' +
'function escClose(e) {\n' +
'  if (e.key === "Escape") closeModal();\n' +
'}\n' +
'\n' +
'function rowsLive() {\n' +
'  return Array.from(document.querySelectorAll(".row"));\n' +
'}\n' +
'function focusedWorktree() {\n' +
'  return lastState ? lastState.worktrees[focusIdx] : null;\n' +
'}\n' +
'function moveFocus(delta) {\n' +
'  if (!lastState || lastState.worktrees.length === 0) return;\n' +
'  focusIdx = (focusIdx + delta + lastState.worktrees.length) % lastState.worktrees.length;\n' +
'  rowsLive().forEach((r, i) => r.classList.toggle("focused", i === focusIdx));\n' +
'  const row = rowsLive()[focusIdx];\n' +
'  if (row) row.scrollIntoView({ block: "nearest" });\n' +
'}\n' +
'\n' +
'document.addEventListener("click", async (e) => {\n' +
'  const copy = e.target.closest("a[data-action=\\"copy-log\\"]");\n' +
'  if (copy) {\n' +
'    e.preventDefault();\n' +
'    try { await navigator.clipboard.writeText(copy.dataset.log); markStale("log path copied"); setTimeout(tick, 1500); }\n' +
'    catch { window.prompt("log path:", copy.dataset.log); }\n' +
'    return;\n' +
'  }\n' +
'  const btn = e.target.closest("button[data-action]");\n' +
'  if (!btn || btn.disabled) return;\n' +
'  e.preventDefault();\n' +
'  const action = btn.dataset.action;\n' +
'  if (action === "remove") {\n' +
'    openRemoveModal(btn.dataset.branch || "this worktree", btn.dataset.path);\n' +
'    return;\n' +
'  }\n' +
'  btn.disabled = true;\n' +
'  await callAction(action, btn.dataset.path);\n' +
'});\n' +
'\n' +
'document.addEventListener("keydown", (e) => {\n' +
'  if (document.getElementById("modal-root").childElementCount > 0) return;\n' +
'  if (e.target.matches("input, textarea")) return;\n' +
'  const w = focusedWorktree();\n' +
'  if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); moveFocus(1); return; }\n' +
'  if (e.key === "k" || e.key === "ArrowUp")   { e.preventDefault(); moveFocus(-1); return; }\n' +
'  if (!w) return;\n' +
'  if (e.key === "Enter" && w.webUp && w.webPort) {\n' +
'    e.preventDefault(); window.open("http://localhost:" + w.webPort, "_blank", "noopener");\n' +
'    return;\n' +
'  }\n' +
'  if (w.isMain) return;\n' +
'  if (e.key === "u" && !(w.apiUp || w.webUp) && !w.pending) { e.preventDefault(); callAction("up", w.path); }\n' +
'  else if (e.key === "s" && (w.apiUp || w.webUp) && !w.pending) { e.preventDefault(); callAction("down", w.path); }\n' +
'  else if (e.key === "r" && !w.pending) { e.preventDefault(); openRemoveModal(w.branch, w.path); }\n' +
'});\n' +
'\n' +
'document.getElementById("meta").addEventListener("click", () => { tick(); });\n' +
'document.getElementById("meta").addEventListener("keydown", (e) => {\n' +
'  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tick(); }\n' +
'});\n' +
'\n' +
'document.addEventListener("visibilitychange", () => {\n' +
'  polling = document.visibilityState === "visible";\n' +
'  if (polling) tick();\n' +
'});\n' +
'\n' +
'window.addEventListener("beforeunload", (e) => {\n' +
'  if (!lastState) return;\n' +
'  const inFlight = lastState.worktrees.some((w) => w.pending && w.pending.exitCode == null);\n' +
'  if (inFlight) { e.preventDefault(); e.returnValue = ""; }\n' +
'});\n' +
'\n' +
'tick();\n' +
'setInterval(tick, POLL_MS);\n' +
'</script>\n' +
'</body>\n' +
'</html>\n';

// ──────────────────────────────────────────────────────────────────────────
// Server
// ──────────────────────────────────────────────────────────────────────────

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
    if (req.url === '/api/up') return handleAction(req, res, 'up');
    if (req.url === '/api/down') return handleAction(req, res, 'down');
    if (req.url === '/api/remove') return handleAction(req, res, 'remove');
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end(String(err?.stack ?? err));
  }
});

server.listen(PORT, () => {
  console.log('plekje · worktrees → http://localhost:' + PORT);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
