import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['explorer.nfxblockchain.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:5220',
        changeOrigin: true
      }
    }
  }
})