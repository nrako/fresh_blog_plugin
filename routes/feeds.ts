import { Handlers } from '$fresh/server.ts'
import { Feed, type Item as FeedItem } from 'https://esm.sh/feed@4.2.2'
import { getPosts } from '../post.ts'
import { BlogOptions } from '../mod.ts'

export function createFeedHandler(options: BlogOptions): Handlers {
  return {
    async GET(req, _ctx) {
      const url = new URL(req.url)
      const origin = url.origin
      const copyright = options.copyright.replace(
        '{{year}}',
        `${new Date().getFullYear()}`,
      ).replace('{{url}}', origin)

      const feed = new Feed({
        title: options.title,
        description: options.description,
        id: `${origin}${options.path}`,
        link: `${origin}${options.path}`,
        language: 'en',
        favicon: `${origin}${options.favicon}`,
        copyright,
        generator: options.generator,
        feedLinks: {
          atom: `${origin}${options.feedPathPrefix}/atom`,
          rss: `${origin}${options.feedPathPrefix}/rss`,
          json: `${origin}${options.feedPathPrefix}/json`,
        },
      })

      const posts = await getPosts(options.contentDir)

      posts.map((post) => {
        const item: FeedItem = {
          id: `${origin}/${post.title}`,
          title: post.title,
          description: post.description,
          date: post.date,
          link: `${origin}${options.path}/${post.slug}`,
          copyright,
          published: post.date,
        }
        feed.addItem(item)
      })

      if (req.url.match(/atom$/)) {
        const atomFeed = feed.atom1()
        return new Response(atomFeed, {
          headers: {
            'content-type': 'application/atom+xml; charset=utf-8',
          },
        })
      } else if (req.url.match(/rss$/)) {
        const rssFeed = feed.rss2()
        return new Response(rssFeed, {
          headers: {
            'content-type': 'application/rss+xml; charset=utf-8',
          },
        })
      } else {
        const jsonFeed = feed.json1()
        return new Response(jsonFeed, {
          headers: {
            'content-type': 'application/json; charset=utf-8',
          },
        })
      }
    },
  }
}
