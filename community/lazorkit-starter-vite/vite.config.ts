import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io', 'localhost'],
  },
})
