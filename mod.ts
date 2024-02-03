import { Plugin, type PluginMiddleware } from '$fresh/server.ts'
import createBlog from './src/routes/blog.tsx'
import { createPostHandler, createPostPage } from './src/routes/post.tsx'
import { createFeedHandler } from './src/routes/feeds.ts'
import * as path from '$std/path/mod.ts'

export interface BlogOptions {
  title?: string
  description?: string
  language?: string
  contentDir?: string
  path?: string
  feedPathPrefix?: string // default same as `path` but can be set to empty i.e `''` to have feeds on `/rss`, `/atom`, `/json`
  favicon?: string
  copyright?: string
  generator?: string
  highlighter?: {
    theme: string
  }
  cssFilename?: string
  dev?: boolean
}

const defaultOption = {
  title: 'Blog',
  description: 'This is a Fresh Blog',
  language: 'en',
  contentDir: './posts',
  path: '/blog',
  feedPathPrefix: '/blog',
  favicon: '/favicon.ico',
  copyright: 'Copyright {{year}} {{url}}',
  generator: 'Feed (https://github.com/jpmonette/feed) for Deno',
  highlighter: { theme: 'nord' },
  cssFilename: 'freshblog.css',
  dev: false,
}

export default function blogPlugin(
  partialOptions: BlogOptions = defaultOption,
): Plugin {
  const options = { ...defaultOption, ...partialOptions }

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
