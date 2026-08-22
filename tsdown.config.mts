import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'node24',
  minify: true,
  // Inline all dependencies so the published action needs no node_modules.
  deps: {
    alwaysBundle: [/.*/],
  },
  clean: true,
  dts: false,
});
