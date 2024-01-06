import { assertEquals } from '$std/assert/assert_equals.ts'
import { type BlogOptions } from '../mod.ts'
import { createFreshBlogHandler, docForPath } from './utils.ts'

const blogOptions: BlogOptions = {
  contentDir: './tests/fixture/posts/',
}

Deno.test('render frontmatter metadata', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog/hello_world')

  assertEquals(doc?.querySelector('h1')?.textContent, 'Hello World')
  assertEquals(doc?.querySelector('time')?.textContent, 'January 2, 2024')
})

Deno.test('render markdown', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog/post_x')

  assertEquals(doc?.querySelector('h2')?.textContent, 'Heading 2')
  assertEquals(doc?.querySelector('blockquote')?.textContent, '\nThis is a blockquote\n')
})

Deno.test('render on specified path', async () => {
  const handler = await createFreshBlogHandler({ ...blogOptions, path: '/rants' })
  const doc = await docForPath(handler, '/rants/hello_world')

  assertEquals(doc?.querySelector('h1')?.textContent, 'Hello World')
})

Deno.test('returns a 404 if the post does not exist', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request(`http://127.0.0.1/blog/bigfoot`),
  )
  assertEquals(resp.status, 404)
})
