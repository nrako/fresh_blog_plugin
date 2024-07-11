import { Handlers } from '$fresh/server.ts'
import { Feed, type Item as FeedItem } from 'https://esm.sh/feed@4.2.2'
import { getPosts } from '../data.ts'
import { InternalOptions } from '../../mod.ts'
import { getFeedPathPrefix } from '../utils/index.ts'

export function createFeedHandler(options: InternalOptions): Handlers {
  const feedPathPrefix = getFeedPathPrefix(options)
  return {
    async GET(req, _ctx) {
      const url = new URL(req.url)
      const origin = url.origin
      const copyright = options.copyright.replace(
        '{{year}}',
        `${new Date().getFullYear()}`,
      ).replace('{{url}}', origin)

      const posts = await getPosts(options)

      let updated: Date | undefined = undefined
      if (posts[0].frontmatter.date) {
        updated = new Date(posts[0].frontmatter.date)
        if (!(updated instanceof Date) || !isFinite(+updated)) {
          updated = undefined
        }
      }

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
          atom: `${origin}${feedPathPrefix}/atom`,
          rss: `${origin}${feedPathPrefix}/rss`,
          json: `${origin}${feedPathPrefix}/json`,
        },
        updated,
      })

      posts.map((post) => {
        const item: FeedItem = {
          id: `${origin}/${post.slug}`,
          title: post.frontmatter.title ?? post.slug,
          description: post.frontmatter.description,
          date: new Date(post.frontmatter.date ?? ''),
          link: `${origin}${options.path}/${post.slug}`,
          copyright,
          published: new Date(post.frontmatter.date ?? ''),
          content: post.content,
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
