import type { BlogOptions } from '../mod.ts'
import { assertEquals } from '@std/assert'
import { createFreshBlogHandler, docForPath } from './utils.ts'

const blogOptions: BlogOptions = {
  contentDir: './tests/fixture/posts/',
}

Deno.test('render frontmatter metadata', async () => {
  const handler = await createFreshBlogHandler({
    contentDir: './tests/fixture/frontmatter/',
  })
  const doc = await docForPath(handler, '/blog/supported')

  assertEquals(doc?.querySelector('header h1')?.textContent, 'Hello World')
  assertEquals(doc?.querySelector('header p')?.textContent, 'A subtitle')
  assertEquals(
    doc?.querySelector('header time')?.textContent,
    'January 2, 2024',
  )
})

Deno.test('render markdown', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog/post_x')

  assertEquals(
    doc?.querySelector('.freshBlog-post-content h2')?.textContent,
    'Heading 2',
  )
  assertEquals(
    doc?.querySelector('blockquote')?.textContent,
    '\nThis is a blockquote\n',
  )
})

Deno.test('render on specified path', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    path: '/rants',
  })
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

Deno.test('renders frontmatter errors in development', async () => {
  const handler = await createFreshBlogHandler({
    contentDir: './tests/fixture/frontmatter/',
    dev: true,
  })
  const doc = await docForPath(handler, '/blog/error_invalid_date')

  assertEquals(
    doc?.querySelector('[role="alertdialog"] dt')?.textContent,
    '🚫 date',
  )
  assertEquals(
    doc?.querySelector('[role="alertdialog"] dd')?.textContent,
    `'date' invalid date "bad" - must be ISO 8601 format or IETF timestamp (at frontmatter)`,
  )
})

Deno.test('renders frontmatter warning in development', async () => {
  const handler = await createFreshBlogHandler({
    contentDir: './tests/fixture/frontmatter/',
    dev: true,
  })
  const doc = await docForPath(handler, '/blog/warning_extra_key')

  assertEquals(
    doc?.querySelector('[role="alertdialog"] dt')?.textContent,
    '⚠️ frontmatter',
  )
  assertEquals(
    doc?.querySelector('[role="alertdialog"] dd')?.textContent,
    `'frontmatter' extra key ignored: foo`,
  )
})
