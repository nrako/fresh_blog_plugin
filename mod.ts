import { Plugin } from '$fresh/server.ts'
import createBlog from './routes/blog.tsx'
import { createPostHandler, createPostPage } from './routes/post.tsx'
import { createFeedHandler } from './routes/feeds.ts'

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
}

export default function blogPlugin(
  partialOptions: BlogOptions = defaultOption,
): Plugin {
  const options = { ...defaultOption, ...partialOptions }

  return {
    name: 'fresh-blog-plugin',
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
