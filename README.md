🚧 WIP! This is an early work in progress. Use or contribute at your own peril.

# Fresh Blog Plugin

A [🍋 Fresh](https://fresh.deno.dev) plugin designed to add blog functionalities
with simple markdown files powered by **[MyST](https://mystmd.org)**.

## Features

- **[MyST](https://mystmd.org) Markdown syntax**: For technical and scientific
  writtings, including code syntax highlight and LaTeX support. Of course, good
  old standard Markdown aka [CommonMark](https://mystmd.org/guide/commonmark) is
  fully supported.
- **Automatic Feed Syndication**: Automatically generate feeds for RSS 2.0, JSON
  Feed 1.0, and Atom 1.0, making your writings easily accessible and
  distributable on the open web.
- **Modular Design**: Minmal and ESM coomponents, so if you don't like the
  default TailwindCSS component, build your routes with your own components and
  only re-use the data and processed HTML content for each mardown files.

## Getting Started

### Installation

To incorporate the Fresh Blog Plugin into your Fresh website, update your
fresh.config.ts file as follows:

```typescript
import { defineConfig } from '$fresh/server.ts'
import tailwind from '$fresh/plugins/tailwind.ts'
import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'

export default defineConfig({
  plugins: [tailwind(), blogPlugin()],
})
```

**Note**: The use of TailwindCSS plugin `tailwind()` is optional. You are free
to omit `tailwind()` if you choose to use your own components.

### TailwindCSS Configuration

When opting for the default TailwindCSS setup, ensure your `tailwind.config.ts`
file includes the following `content` rules to ensures the necessary TailwindCSS
utilities aren't pruned.

```typescript
import { type Config } from 'tailwindcss'
import typographyPlugin from 'npm:@tailwindcss/typography'

export default {
  plugins: [typographyPlugin],
  content: [
    '{routes,islands,components}/**/*.{ts,tsx}',

    // For Fresh Blog Plugin
    'node_modules/.deno/fresh_blog_plugin/components/**/*.tsx',
    'node_modules/.deno/fresh_blog_plugin/routes/**/*.tsx',
    'posts/*.md', // this must match `options.contentDir`
  ],
} satisfies Config
```

**Note**: The last rule to match `options.contentDir` is recommended and allow
you to use TailwindCSS utilities in your markdown files.

### Additional Styling

Incorporate `/freshblog.css` in your layout files to apply CSS rules specific to
code syntax highlighting and various MyST features:

```html
<!-- Add to your routes/_app.tsx -->
<link rel="stylesheet" href="/freshblog.css" />
```

The `/freshblog.css` file will be served during development and automatically
exported at build time. You can inspect its content in
[`./styles.css`](https://github.com/nrako/fresh_blog_plugin/blob/main/styles.css).

## Options

https://github.com/nrako/fresh_blog_plugin/blob/8c065f16088328e9e3f43300d2bafea9c9df84cb/mod.ts#L7-L67

## Example

Browse the `/example` folder to see how `blogPlugin()` is used. You will see
that a Fresh website can contain multiple blogs.

You can also run the example with `deno task example`.
