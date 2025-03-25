import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Add base for deployment
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173, // Fixed port
    strictPort: true // Fail if port is already in use
  },
  build: {
    outDir: 'dist', // Output directory for build
    sourcemap: false, // Disable sourcemaps in production
  }
})