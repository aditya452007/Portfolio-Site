import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Matches the "paths" config in tsconfig.json
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Equivalent to '0.0.0.0', allows network access
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabled for production to save bandwidth
    chunkSizeWarningLimit: 1600, // Supresses warnings for large animations
  },
  // Explicitly tell Vite where the .env file lives (root)
  envDir: '.', 
});