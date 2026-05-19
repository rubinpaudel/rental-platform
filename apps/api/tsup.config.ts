import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { main: 'src/main.ts' },
  format: ['esm'],
  target: 'node22',
  platform: 'node',
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: true,
  // NestJS DI relies on decorator metadata that esbuild does not emit. We
  // avoid that by always injecting via explicit @Inject(TOKEN), and keep
  // framework deps external so Node resolves the installed versions at
  // runtime.
  external: [
    /^@nestjs\//,
    /^@rental-platform\//,
    /^@aws-sdk\//,
    'drizzle-orm',
    'postgres',
    'reflect-metadata',
    'rxjs',
    'zod',
  ],
  esbuildOptions(options) {
    options.banner = { js: "import 'reflect-metadata';" };
  },
});
