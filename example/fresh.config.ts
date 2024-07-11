import { defineConfig } from '$fresh/server.ts'
import tailwind from '$fresh/plugins/tailwind.ts'
import blogPlugin from '../mod.ts'

export default defineConfig({
  plugins: [
    tailwind(),
    blogPlugin({
      contentDir: '../tests/fixture/posts',
      showAuthors: 'always',
    }),
    blogPlugin({
      title: 'Markdown Specs',
      path: '/specs',
      contentDir: '../tests/fixture/specs',
    }),
  ],
})
