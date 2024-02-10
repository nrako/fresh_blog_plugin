# Fresh Blog Plugin

A [🍋 Fresh](https://fresh.deno.dev) plugin to add blog functionalities powered
by markdown files with the power of [MyST](https://mystmd.org).

## Getting Started

Setup the `blogPlugin` your `fresh.config.ts` file:

```typescript
import { defineConfig } from '$fresh/server.ts'
import tailwind from '$fresh/plugins/tailwind.ts'
import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'

export default defineConfig({
  plugins: [tailwind(), blogPlugin()],
})
```

TailwindCSS is used by the components, you are free to omit `tailwind()` if you
choose to use your own components.

When using TailwindCSS you must add new `content` rules for
`fresh-blog-plugin`'s CSS and any HTML you may use in your posts:

```typescript
import { type Config } from 'tailwindcss'
import typographyPlugin from 'npm:@tailwindcss/typography'

export default {
  plugins: [typographyPlugin],
  content: [
    '{routes,islands,components}/**/*.{ts,tsx}',
    '../fresh_blog_plugin/components/**/*.tsx', // TODO replace by node_modules/fresh_blog_plugin ... ?
    '../fresh_blog_plugin/routes/**/*.tsx', // TODO replace by node_modules/fresh_blog_plugin ... ?
    'posts/*.md', // this must match `options.contentDir`
  ],
} satisfies Config
```

The last rule matching options.contentDir is optional and only recommended if
you use TailwindCSS utilities in your markdown files.

Additionally add `/freshblog.css` to the layout file(s) which will be used to
display your blog(s):

```html
<!-- Add to your routes/_app.tsx -->
<link rel="stylesheet" href="/freshblog.css" />
```

The content of `/freshblog.css` is in `./styles.css`.

## Options

TODO
