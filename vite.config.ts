import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // ensures relative paths so it works correctly on Render
  build: {
    outDir: 'docs', // tells Vite to output static site to 'docs' folder
  },
}
