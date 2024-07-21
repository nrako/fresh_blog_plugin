import type { BlogOptions } from '../mod.ts'
import { assertEquals, assertStringIncludes } from '@std/assert'
import { createFreshBlogHandler, docForPath } from './utils.ts'

const blogOptions: BlogOptions = {
  contentDir: './tests/fixture/posts/',
}

Deno.test('list all posts sorted by date', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog')

  const blogLinks = doc?.querySelectorAll('main a[href^="/blog/"]')

  assertEquals(blogLinks.length, 2)
  assertEquals(Array.from(blogLinks).map((element) => element.textContent), [
    'Post XJanuary 6, 2024desc',
    'Hello WorldJanuary 2, 2024yello, description',
  ])
})

Deno.test('display the blog title', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    title: 'Fresh Blog Plugin News',
  })
  const doc = await docForPath(handler, '/blog')

  assertEquals(doc?.querySelector('h1')?.textContent, 'Fresh Blog Plugin News')
})

Deno.test('display the feeds links in the footer', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog')

  const feedLinks = [
    ...doc?.querySelectorAll('footer a'),
  ] as unknown as HTMLElement[]
  const links = feedLinks.map((element) => ({
    href: element.getAttribute('href'),
    title: element.getAttribute('title'),
  }))

  assertEquals(links, [
    {
      href: '/blog/atom',
      title: 'Atom 1.0',
    },
    {
      href: '/blog/json',
      title: 'JSON Feed 1.0',
    },
    {
      href: '/blog/rss',
      title: 'RSS 2.0',
    },
  ])
})

Deno.test('display the feeds links at the root if `feedPathPrefix` is set to empty string', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    feedPathPrefix: '',
  })
  const doc = await docForPath(handler, '/blog')

  const feedLinks = [
    ...doc?.querySelectorAll('footer a'),
  ] as unknown as HTMLElement[]

  assertEquals(feedLinks.map((element) => element.getAttribute('href')), [
    '/atom',
    '/json',
    '/rss',
  ])
})

Deno.test('display empty posts', async () => {
  const handler = await createFreshBlogHandler({
    contentDir: './tests/fixture/empty_posts/',
  })
  const doc = await docForPath(handler, '/blog')
  assertStringIncludes(doc.textContent, "There's no posts yet.")
})
