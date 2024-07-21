import type { Plugin, PluginMiddleware } from '$fresh/server.ts'
import type { PageFrontmatter } from 'myst-frontmatter'
import createBlog from './src/routes/blog.tsx'
import { createPostHandler, createPostPage } from './src/routes/post.tsx'
import { createFeedHandler } from './src/routes/feeds.ts'
import * as path from '$std/path/mod.ts'
import { getFeedPathPrefix } from './src/utils/index.ts'

export const postcssProcess = async (css: string): Promise<string> => {
  const { default: postcss } = await import('npm:postcss@8')
  const { default: postcssNesting } = await import(
    'https://esm.sh/postcss-nesting@12.0.2'
  )
  const { default: atImport } = await import('npm:postcss-import@16')
  // @ts-ignore somehow no overload match the plugin
  return (await postcss([postcssNesting({})])
    .use(atImport({
      path: path.join(path.dirname(path.fromFileUrl(import.meta.url)), 'src'),
    }))
    .process(css, {
      from: './src',
    })).css
}

export type BlogOptions = Partial<InternalOptions>

export interface InternalOptions {
  /**
   * Title of the blog
   * @default { 'Blog' }
   */
  title: string
  /**
   * Description of the blog content, this is used in the syndicate feeds
   * @default { 'This is a Fresh Blog' }
   */
  description: string
  /**
   * Language code BCP 47, currently used to format date and time format
   * @default { 'en' }
   */
  language: string
  /**
   * Path to folder containing the markdown (*.md) files
   * @default { './posts' }
   */
  contentDir: string
  /**
   * URL path of the blog index page
   * @default { '/blog' }
   */
  path: string
  /**
   * URL path prefix for the blog feeds (rss, atom, json), default will use the same as `path` but it can be set to empty i.e `''` to have feeds on `/rss`, `/atom`, `/json`
   * @default { undefined }
   */
  feedPathPrefix?: string
  /**
   * Path of the favicon, this is used in the feeds
   * @default { '/favicon.ico' }
   */
  favicon: string
  /**
   * Copyright text, `{{year}}` and `{{url}}` can be used for automatic replacement
   * @default { 'Copryright {{year}} {{url}}' }
   */
  copyright: string
  /**
   * A string used in RSS 2.0 feed to indicate the program used to generate the channel.
   * @default { 'Feed (https://github.com/jpmonette/feed) for Deno' }
   */
  generator: string
  /**
   * Configuration passed to the code highlighter Shiki where `light` and `dark`
   * themes can be set. See https://shiki.style/themes for supported themes.
   * @default { { themes: { light: 'material-theme-lighter', dark: 'material-theme-darker' } } }
   */
  highlighter: {
    themes: {
      light: string
      dark: string
    }
  }
  /**
   * Name of the CSS file which will be exported by the plugin for the blog
   * @default { 'freshblog.css' }
   */
  cssFilename: string
  /**
   * Name of the JavaScript file (polyfill) which will be exported by the plugin for the blog
   * @default { 'freshblog.js' }
   */
  jsFilename: string
  /** Determine the author(s) to display for all posts when the `authors` entry
   * is not defined in frontmatter. Useful for personal blog when the author is
   * often the same and rarely need to be overridden.
   * @default { undefined }
   */
  defaultAuthors?: PageFrontmatter['authors']
  /** Determines when to show authors
   * ```
   * 'always' - always show authors in both the listing of blog posts and in the post
   * 'only_in_posts' - only show authors in the post
   * 'never' - never show authors
   * ```
   *  @default 'only_in_posts'
   */
  showAuthors: 'always' | 'only_in_posts' | 'never'
  /** This is used to mock a dev environement in tests do not use this
   * @ignore
   */
  dev?: boolean
}

/**
 * @ignore
 */
export const defaultOptions = {
  title: 'Blog',
  description: 'This is a Fresh Blog',
  language: 'en',
  contentDir: './posts',
  path: '/blog',
  favicon: '/favicon.ico',
  copyright: 'Copyright {{year}} {{url}}',
  generator: 'Feed (https://github.com/jpmonette/feed) for Deno',
  highlighter: {
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-darker',
    },
  },
  cssFilename: 'freshblog.css',
  jsFilename: 'freshblog.js',
  showAuthors: 'only_in_posts' as 'always' | 'only_in_posts' | 'never',
  dev: false,
}

/**
 * Fresh `blogPlugin` factory function to add blogging functionalities on a [🍋
 * Fresh](https://fresh.deno.dev) Deno website with customizable options. The
 * plugin provides middleware for serving CSS and JS files during development,
 * handles static file generation for production, and sets up routes for blog
 * content, including posts and feeds.
 *
 * @param {BlogOptions} - Optional configuration
 * options for the blog plugin. If not provided, defaults will be used. The
 * options allow for customization of paths, filenames, and blog attributes.
 * @returns {Plugin} An object conforming to the [🍋
 * Fresh](https://fresh.deno.dev) plugin interface
 *
 * @example Simple Example
 * ```ts
 * import { defineConfig } from '$fresh/server.ts'
 * import tailwind from '$fresh/plugins/tailwind.ts'
 * import blogPlugin from 'https://deno.land/x/fresh_blog_plugin/mod.ts'
 *
 * export default defineConfig({
 *   plugins: [
 *      tailwind(),
 *      blogPlugin({
 *        path: '/thoughts',
 *        title: 'My Thoughts',
 *        description: 'A collection of my thoughts',
 *      }),
 * })
 * ```
 */
export default function blogPlugin(
  partialOptions: BlogOptions = defaultOptions,
): Plugin {
  const options = {
    ...defaultOptions,
    ...partialOptions,
  }

  let cache = ''

  const devMiddleware: PluginMiddleware = {
    path: '/',
    middleware: {
      handler: async (_req, ctx) => {
        const pathname = ctx.url.pathname

        const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

        if (pathname.endsWith(`/${options.cssFilename}`)) {
          if (!cache) {
            const css = await Deno.readTextFile(
              path.join(__dirname, 'src', 'styles.css'),
            )
            cache = await postcssProcess(css)
          }

          return new Response(cache, {
            status: 200,
            headers: {
              'Content-Type': 'text/css',
              'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
          })
        }

        if (pathname.endsWith(`/${options.jsFilename}`)) {
          const jsContent = await Deno.readTextFile(
            path.join(__dirname, 'src', 'client.js'),
          )
          return new Response(jsContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/javascript',
              'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
          })
        }

        return ctx.next()
      },
    },
  }

  const middlewares: Plugin['middlewares'] = []
  const feedPathPrefix = getFeedPathPrefix(options)

  return {
    name: 'fresh-blog-plugin',
    configResolved(config) {
      if (options.dev || config.dev) {
        middlewares.push(devMiddleware)
      }
    },
    async buildStart(config) {
      const outDir = path.join(config.build.outDir, 'static')
      const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
      const cssOutPath = path.join(outDir, options.cssFilename)

      try {
        await Deno.mkdir(path.dirname(cssOutPath), { recursive: true })
      } catch (err) {
        if (!(err instanceof Deno.errors.AlreadyExists)) {
          throw err
        }
      }

      const css = await Deno.readTextFile(
        path.join(__dirname, 'src', 'styles.css'),
      )

      const cssProcessed = await postcssProcess(css)
      await Deno.writeTextFile(cssOutPath, cssProcessed)
      await Deno.copyFile(
        path.join(__dirname, 'src', 'client.js'),
        path.join(outDir, options.jsFilename),
      )
    },
    middlewares,
    routes: [
      {
        path: options.path ?? defaultOptions.path!,
        component: createBlog(options),
      },
      {
        path: `${feedPathPrefix}/atom`,
        handler: createFeedHandler(options),
      },
      {
        path: `${feedPathPrefix}/json`,
        handler: createFeedHandler(options),
      },
      {
        path: `${feedPathPrefix}/rss`,
        handler: createFeedHandler(options),
      },
      {
        path: `${options.path ?? defaultOptions.path!}/:slug`,
        handler: createPostHandler(options),
        component: createPostPage(options),
      },
    ],
  }
}
