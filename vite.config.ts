import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
      'components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
    }
  }
})
