🚧 Work in Progress! This is still an early-stage project. Engage with it or
contribute at your own risk.

# Fresh Blog Plugin

**A [🍋 Fresh](https://fresh.deno.dev) plugin designed to add blog
functionalities with markdown files powered by [MyST](https://mystmd.org)**.

## Features

- **[MyST](https://mystmd.org) Markdown syntax**: Offers an extended and richer
  Markdown syntax that caters not only to technical and scientific writing but
  also perfectly suits any kind of authoring and blogging. Naturally, it fully
  supports the standard Markdown, also known as
  [CommonMark](https://mystmd.org/guide/commonmark).
- **Code & Math**: Features code syntax highlighting and Tex Math rendering
  support out of the box, thanks to [Shiki](https://shiki.style) and
  [Katex](https://www.npmjs.com/package/rehype-katex).
- **Automatic Feed Syndication**: Seamlessly generates feeds for JSON Feed 1.0,
  Atom 1.0 and RSS 2.0. Ensures your content is readily consumable through any
  feed syndicate readers.
- **Modular Design**: Minimal, re-usable, ESM, functional components. If the
  default TailwindCSS component doesn't suit your taste, you have the freedom to
  craft your routes with your custom components. You can still leverage the data
  and processed HTML content from each markdown file.


## How It Works

This plugin exposes multiple configurable routes:

- Blog Index Route (default `/blog`): listing all posts sorted by their `date`
- Blog Post Route (default `/blog/:slug`): showing the detail of a post
  identified by the `:slug` which is inferred from the markdown file name
- Atom 1.0 Feed Route (default `/blog/atom`)
- JSON Feed 1.0 Feed Route (default `/blog/json`)
- RSS 2.0 Feed Route (default `/blog/rss`)
- Provide an optional and minimal CSS (default `/freshblog.css`)

This plugin doesn't make any assumption about your layouts (i.e `_layout.tsx`)
or your App Wrapper (i.e `routes/_app.tsx`).

For customization of the default routes and other options, please refer to the
"[Options](https://github.com/nrako/fresh_blog_plugin?tab=readme-ov-file#options)"
section below.


## Getting Started

### Installation

To incorporate the Fresh Blog Plugin into your Fresh website, update your
fresh.config.ts file as follows:

```typescript
import { defineConfig } from '$fresh/server.ts'
import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'

export default defineConfig({
  plugins: [blogPlugin()],
})
```

That's it, by default your blog is now accessible on the `/blog` path.

### Include Default Styles (optional)

Some minimal CSS is included with this plugin which you're free to adopt or use as the basis for your own CSS.

This include styles for various components and the code syntax highlighting.

```html
<!-- Add to your App Wrapper `routes/_app.tsx` -->
<link rel="stylesheet" href="/freshblog.css" />
```

The `/freshblog.css` file is served during development and automatically
exported to your static files at build time. You can inspect its content in
[`./styles.css`](https://github.com/nrako/fresh_blog_plugin/blob/main/styles.css).

### TailwindCSS Configuration & Gotchas (optional)

TailwinCSS's plugin `@tailwindcss/typography` can be of great use to easily
style the content of your posts.

By default the post content is wrapped with the `.prose` CSS class and can be
changed with other size variants, color scale or modifiers from the [Typography
plugin](https://tailwindcss.com/docs/typography-plugin).

#### Example of a `tailwind.config.ts`:

```typescript
import { type Config } from 'tailwindcss'
import typographyPlugin from 'npm:@tailwindcss/typography'

export default {
  plugins: [typographyPlugin],
  content: [
    '{routes,islands,components}/**/*.{ts,tsx}',
    'posts/*.md', // this must match `options.contentDir`
  ],
} satisfies Config
```

**Gotcha**: It's advisable to align the last rule with your
*`options.contentDir`(s)
to ensure any TailwindCSS utilities used within your markdown files don't get
pruned.

As a reminder here's the `fresh.config.ts` config for TailwindCSS:

```typescript
import { defineConfig } from '$fresh/server.ts'
import tailwind from '$fresh/plugins/tailwind.ts'
import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'

export default defineConfig({
  plugins: [tailwind(), blogPlugin()],
})
```

## Options

https://github.com/nrako/fresh_blog_plugin/blob/8c065f16088328e9e3f43300d2bafea9c9df84cb/mod.ts#L7-L67

## API

The API documentation available on https://nrako.github.io/fresh_blog_plugin/

## Example

Explore the
[`/example`](https://github.com/nrako/fresh_blog_plugin/tree/main/example)
directory to understand how `blogPlugin()` can be implemented. The example
demonstrates that a Fresh website can host multiple blogs.

You can also run the example with `deno task example`.

## Provisional License Statement

### Current License

This project is licensed under the
[GNU Lesser General Public License (LGPLv3)](LICENSE.md), selected for its
framework that encourages open contributions to the project while facilitating
the use of this library/project in both open source and proprietary software.
This licensing approach aims to foster a collaborative development environment
and maximize the library's/project's applicability and impact across diverse
software ecosystems.

### Future Licensing

Upon reaching maturity and stability milestones, consideration will be given to
adopting a more permissive license, such as the
[ISC License](https://en.wikipedia.org/wiki/ISC_license). Such change would aim
to eliminate obligations and extend permissions, fully unleashing the project's
potential. Meanwhile, contributors are encouraged to work within the current
LGPLv3 licensing framework, ensuring that enhancements and modifications
continue to serve the greater good.
