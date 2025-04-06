import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false,
    fs: {
      strict: false // Allow serving files from node_modules
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    open: false
  }
});