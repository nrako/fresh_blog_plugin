import { Plugin, type PluginMiddleware } from '$fresh/server.ts'
import createBlog from './src/routes/blog.tsx'
import { createPostHandler, createPostPage } from './src/routes/post.tsx'
import { createFeedHandler } from './src/routes/feeds.ts'
import * as path from '$std/path/mod.ts'

export interface BlogOptions {
  /**
   * Title of the blog
   * @default { 'Blog' }
   */
  title?: string
  /**
   * Description of the blog content, this is used in the syndicate feeds
   * @default { 'This is a Fresh Blog' }
   */
  description?: string
  /**
   * Language code BCP 47, currently used to format date and time format
   * @default { 'en' }
   */
  language?: string
  /**
   * Path to folder containing the markdown (*.md) files
   * @default { './posts' }
   */
  contentDir?: string
  /**
   * URL path of the blog index page
   * @default { '/blog' }
   */
  path?: string
  /**
   * URL path prefix for the blog feeds (rss, atom, json), default will use the same as `path` but it can be set to empty i.e `''` to have feeds on `/rss`, `/atom`, `/json`
   */
  feedPathPrefix?: string
  /**
   * Path of the favicon, this is used in the feeds
   * @default { '/favicon.ico' }
   */
  favicon?: string
  /**
   * Copyright text, `{{year}}` and `{{url}}` can be used for automatic replacement
   * @default { 'Copryright {{year}} {{url}}' }
   */
  copyright?: string
  /**
   * A string used in RSS 2.0 feed to indicate the program used to generate the channel.
   * @default { 'Feed (https://github.com/jpmonette/feed) for Deno' }
   */
  generator?: string
  /**
   * Configuration passed to the code highlighter Shiki where `light` and `dark`
   * themes can be set. See https://shiki.style/themes for supported themes.
   * @default { { themes: { light: 'material-theme-lighter', dark: 'material-theme-darker' } } }
   */
  highlighter?: {
    themes: {
      light: string
      dark: string
    }
  }
  /**
   * Name of the CSS file which will be exported by the plugin for the blog
   * @default { 'freshblog.css' }
   */
  cssFilename?: string
  /**
   * @ignore
   */
  dev?: boolean
}

/**
 * @ignore
 */
export const defaultOption = {
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
  dev: false,
}

/**
 * Fresh `blogPlugin` factory function to add blogging functionalities on a [🍋
 * Fresh](https://fresh.deno.dev) Deno website with customizable options. The
 * plugin provides middleware for serving CSS files during development, handles
 * static file generation for production, and sets up routes for blog content,
 * including posts and feeds.
 *
 * @param {BlogOptions} [partialOptions=defaultOption] - Optional configuration
 * options for the blog plugin. If not provided, defaults will be used. The
 * options allow for customization of paths, filenames, and blog attributes.
 * @returns {Plugin} An object conforming to the [🍋
 * Fresh](https://fresh.deno.dev) plugin interface
 */
export default function blogPlugin(
  partialOptions: BlogOptions = defaultOption,
): Plugin {
  const options = {
    feedPathPrefix: partialOptions.feedPathPrefix ??
      `${partialOptions.path ?? defaultOption.path}`,
    ...defaultOption,
    ...partialOptions,
  }

  let cache = ''

  const devMiddleware: PluginMiddleware = {
    path: '/',
    middleware: {
      handler: async (_req, ctx) => {
        const pathname = ctx.url.pathname

        if (!pathname.endsWith(`/${options.cssFilename}`)) {
          return ctx.next()
        }

        if (!cache) {
          const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
          cache = await Deno.readTextFile(path.join(__dirname, 'styles.css'))
        }

        return new Response(cache, {
          status: 200,
          headers: {
            'Content-Type': 'text/css',
            'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
          },
        })
      },
    },
  }

  const middlewares: Plugin['middlewares'] = []

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
      const outPath = path.join(outDir, options.cssFilename)

      const content = await Deno.readTextFile(
        path.join(__dirname, 'styles.css'),
      )

      try {
        await Deno.mkdir(path.dirname(outPath), { recursive: true })
      } catch (err) {
        if (!(err instanceof Deno.errors.AlreadyExists)) {
          throw err
        }
      }

      await Deno.writeTextFile(outPath, content)
    },
    middlewares,
    routes: [
      {
        path: options.path ?? defaultOption.path!,
        component: createBlog(options),
      },
      {
        path: `${options.feedPathPrefix}/atom`,
        handler: createFeedHandler(options),
      },
      {
        path: `${options.feedPathPrefix}/json`,
        handler: createFeedHandler(options),
      },
      {
        path: `${options.feedPathPrefix}/rss`,
        handler: createFeedHandler(options),
      },
      {
        path: `${options.path ?? defaultOption.path!}/:slug`,
        handler: createPostHandler(options),
        component: createPostPage(options),
      },
    ],
  }
}
