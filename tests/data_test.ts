import { assert, assertEquals } from '@std/assert'
import { defaultOptions, type InternalOptions } from '../mod.ts'
import { getPost, getPosts } from '../src/data.ts'

const blogOptions: InternalOptions = {
  ...defaultOptions,
  contentDir: './tests/fixture/specs/',
  feedPathPrefix: '',
}

Deno.test('returns post with the transformed HTML content and metadata', async () => {
  const post = await getPost('myst_features', blogOptions)
  if (!post) throw new Error('Post not found')

  const { content: _html, ...metadata } = post

  assertEquals(metadata, {
    slug: 'myst_features',
    frontmatter: {
      title: 'MyST Features',
      subtitle: 'Catalogue of key MyST capabilities',
      date: '2024-01-23 22:40:45 +0002',
      description: 'A page listing some of the MyST features',
    },
    messages: {},
  })
})

Deno.test('returns all posts', async () => {
  const posts = await getPosts(blogOptions)
  if (!posts) throw new Error('Post not found')

  const metadatas = posts.map(({ content: _html, ...metadata }) => metadata)

  assertEquals(metadatas, [{
    slug: 'myst_features',
    frontmatter: {
      title: 'MyST Features',
      subtitle: 'Catalogue of key MyST capabilities',
      date: '2024-01-23 22:40:45 +0002',
      description: 'A page listing some of the MyST features',
    },
    messages: {},
  }, {
    slug: 'markdown_features',
    frontmatter: {
      title: 'Markdown Features',
      date: '2024-01-01 22:40:45 +0002',
      description: 'catalogue of markdown features',
    },
    messages: {},
  }])
})

Deno.test('caching performance improvements', {}, async () => {
  Deno.remove('./tests/fixture/specs/.cache', { recursive: true })
  performance.mark('posts-no-cache-start')
  await getPosts(blogOptions)
  performance.mark('posts-no-cache-end')
  const noCache = performance.measure(
    'posts-no-cache',
    'posts-no-cache-start',
    'posts-no-cache-end',
  )

  performance.mark('posts-cache-start')
  await getPosts(blogOptions)
  performance.mark('posts-cache-end')
  const withCache = performance.measure(
    'posts-cache',
    'posts-cache-start',
    'posts-cache-end',
  )

  const bFactor = noCache.duration / withCache.duration

  assert(
    bFactor > 1.5,
    `Caching should improve performance by a factor at least 1.5x but got ${
      bFactor.toFixed(2)
    }`,
  )
})
