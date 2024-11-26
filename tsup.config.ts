import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main/index.ts', 'src/main/**/*.ts'], // Include all TypeScript files in src/main
  outDir: 'dist/main/',
  format: ['cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
});