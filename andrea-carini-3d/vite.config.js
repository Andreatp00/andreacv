import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '.'),
  build: {
    target: 'es2020',
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle for smaller size
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    },
    assetsInlineLimit: 0, // Force separate asset files
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public'
});
