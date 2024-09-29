🚧 Work in Progress! This is still an early-stage project. Engage with it or
contribute at your own risk.

# Fresh Blog Plugin

**A [🍋 Fresh](https://fresh.deno.dev) plugin designed to add blog
functionalities with markdown files powered by [MyST](https://mystmd.org)**.

## Core Features

- **Robust [MyST Markdown Syntax](https://mystmd.org)**: Expands authoring
  capabilities with a syntax that caters to technical and scientific authoring
  as well as any other blogging needs. Fully compatible with
  [CommonMark](https://mystmd.org/guide/commonmark), the most known and used
  Markdown specification.

- **Code & Math**: Integrates [Shiki](https://shiki.style) for code highlighting
  and [Katex](https://www.npmjs.com/package/rehype-katex) for Tex Math,
  delivering out-of-the-box functionality for technical content.

- **Feed Syndication**: Automatically generates feeds for JSON, Atom, and RSS,
  making content easily accessible and ensuring wide reach.

- **Modular Components**: Offers minimal, reusable components for custom route
  and layout design, providing unmatched flexibility in blog presentation.

## How It Works

This plugin exposes multiple configurable routes:

- Blog Index Route (default `/blog`): listing all posts sorted by their `date`
- Blog Post Route (default `/blog/:slug`): showing the detail of a post
  identified by the `:slug` which is inferred from the markdown file name
- Atom 1.0 Feed Route (default `/blog/atom`)
- JSON Feed 1.0 Feed Route (default `/blog/json`)
- RSS 2.0 Feed Route (default `/blog/rss`)
- Provide an optional and minimal CSS (default `/freshblog.css`)

This plugin is meant to integrate into any existing Fresh website, it doesn't
make any assumption about your styles, layouts (i.e `_layout.tsx`) or your App
Wrapper (i.e `routes/_app.tsx`).

For customization of the default routes path and other options, please refer to
the
"[Options](https://github.com/nrako/fresh_blog_plugin?tab=readme-ov-file#options)"
section below or browse the
[`./example/`](https://github.com/nrako/fresh_blog_plugin/tree/main/example)
directory.

## Getting Started

### Quick Setup

Incorporate the plugin with a simple update to `fresh.config.ts`. Starting a
blog is a matter of adding a few lines of code to an existing Fresh project.

```typescript
import { defineConfig } from '$fresh/server.ts'
// TODO import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'

export default defineConfig({
  // TODO plugins: [blogPlugin()],
})
```

✨ That's it, by default your blog is now accessible on the `/blog` path and
markdown files can be added to the `./posts/` directory.

### Include Client-Side Javascript (Recommended)

A minimal Javascript used for progressive enhancement providing polyfill for
future HTML/CSS features not yet available on all modern browsers.

```html
<!-- Add to your App Wrapper `routes/_app.tsx` -->
<script src="/freshblog.js" type="module" defer />
```

The `/freshblog.js` file is served during development and automatically exported
to your static files at build time. You can inspect its content in
[`./src/client.js`](https://github.com/nrako/fresh_blog_plugin/blob/main/src/client.js).

### Include Default Styles (Optional)

Minimal CSS is included with this plugin which you're free to adopt or use as
the basis for your own CSS.

This include styles for various components and the code syntax highlighting.

```html
<!-- Add to your App Wrapper `routes/_app.tsx` -->
<link rel="stylesheet" href="/freshblog.css" />
```

The `/freshblog.css` file is served during development and automatically
exported to your static files at build time. You can inspect its content in
[`./src/styles.css`](https://github.com/nrako/fresh_blog_plugin/blob/main/src/styles.css).

### TailwindCSS: Configuration & Gotchas (Optional)

[TailwinCSS)(https://fresh.deno.dev/docs/examples/migrating-to-tailwind) and in
particular its
[`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin)
plugin offer a straighforward path to visually style the content of your posts.

The [`./example/`](https://github.com/nrako/fresh_blog_plugin/tree/main/example)
folder demonstrate the usage of TailwindCSS and the `.prose` CSS utilities
classes; size variants, color scale or modifiers.

#### Example of a `tailwind.config.ts`:

```typescript
import { type Config } from 'npm:tailwindcss'
import typographyPlugin from 'npm:@tailwindcss/typography'

const config = {
  plugins: [typographyPlugin],
  content: [],
} satisfies Config

export default config
```

**Gotcha**: It's advisable to align the last rule with your
*`options.contentDir`(s) to ensure any TailwindCSS utilities used within your
markdown files don't get pruned.

## Options

https://github.com/nrako/fresh_blog_plugin/blob/8c065f16088328e9e3f43300d2bafea9c9df84cb/mod.ts#L7-L67

## API

The API documentation is available on https://nrako.github.io/fresh_blog_plugin/

## Example

Explore the
[`./example/`](https://github.com/nrako/fresh_blog_plugin/tree/main/example)
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
