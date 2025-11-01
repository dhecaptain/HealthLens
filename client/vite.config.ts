import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true, // auto-open browser
  },
  build: {
    outDir: 'dist',
  },
})
