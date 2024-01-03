# Fresh Blog Plugin

A [🍋 Fresh] plugin to add blog functionalities powered by markdown files.

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

Otherwise, you must add new `content` rules for `fresh-blog-plugin`'s CSS and
any HTML you may use in your posts:

```typescript
import { type Config } from 'tailwindcss'

export default {
  content: [
    '{routes,islands,components}/**/*.{ts,tsx}',
    '../fresh_blog_plugin/components/**/*.tsx', // TODO replace by node_modules/fresh_blog_plugin ... ?
    'posts/*.md', // this must match `options.contentDir`
  ],
} satisfies Config
```

## Options

TODO

## Extensibility

By default syntax highlighting for JavaScript, Markdown, and HTML is included.
You can include more languages importing them:

import { CSS, render } from "https://deno.land/x/gfm/mod.ts";

// Add support for TypeScript, Bash, and Rust. import
"https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check"; import
"https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check"; import
"https://esm.sh/prismjs@1.29.0/components/prism-rust?no-check"; A full list of
supported languages is available here:
https://unpkg.com/browse/prismjs@1.29.0/components/
