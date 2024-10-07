import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server:{
      host:true,
      port:5173,
      watch:{
        usePolling: true
      }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    }
  }
})
