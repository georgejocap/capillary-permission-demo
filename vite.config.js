import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/capillary-permission-demo/',
  preview: {
    port: parseInt(process.env.PORT) || 4173,
    host: true,
  },
})
