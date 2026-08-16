import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
// Project pages are served from /<repo>/, so use that base for builds only.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wedding-card/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        root: resolve(__dirname, 'index.html'),
        wedding: resolve(__dirname, 'wedding/index.html'),
        nikah: resolve(__dirname, 'nikah/index.html'),
        reception: resolve(__dirname, 'reception/index.html'),
        seating: resolve(__dirname, 'seating/index.html'),
      },
    },
  },
}))
