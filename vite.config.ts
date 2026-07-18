import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Project pages are served from /<repo>/, so use that base for builds only.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wedding-card/' : '/',
  plugins: [react(), tailwindcss()],
}))
