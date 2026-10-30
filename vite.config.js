import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this repo from /atuf-portfolio/
  base: '/atuf-portfolio/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two real HTML pages, so the existing index and contact.html URLs keep working.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        project: resolve(import.meta.dirname, 'project.html'),
      },
    },
  },
})
