import { defineConfig } from 'vite'

// Set base to the repository name so assets load correctly when served from
// https://<username>.github.io/<repo>/ (GitHub Pages using main/docs)
export default defineConfig({
  base: '/cemt-light/'
})
