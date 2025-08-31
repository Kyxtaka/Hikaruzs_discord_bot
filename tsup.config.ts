import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/**/*.ts'], // Include all TypeScript files in src/main
  outDir: 'dist/',
  format: ['cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
});