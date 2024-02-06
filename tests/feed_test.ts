import { assertSnapshot } from '$fresh/src/server/deps.ts'
import { type BlogOptions } from '../mod.ts'
import { createFreshBlogHandler } from './utils.ts'
import { parse, type ParserOptions } from '../deps.ts'

const blogOptions: BlogOptions = {
  contentDir: './tests/fixture/posts/',
}

const parserOptions: ParserOptions = {
  reviver({ value, key: _key, tag, properties: _properties }) {
    // replace the year in the copyright with placerholder
    if (tag === 'rights' && typeof value === 'string') {
      return value.replace(/20\d{2}/, 'YYYY')
    }
    return value
  },
}

Deno.test('Atom 1.0 feed match snapshot', async (t) => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request('http://127.0.0.1/blog/atom'),
  )
  const body = parse(await resp.text(), parserOptions)
  await assertSnapshot(t, body)
})

Deno.test('JSON Feed 1.0 feed match snapshot', async (t) => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request('http://127.0.0.1/blog/json'),
  )
  const body = await resp.text()
  await assertSnapshot(t, body)
})

Deno.test('RSS 2.0 feed match snapshot', async (t) => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request('http://127.0.0.1/blog/rss'),
  )
  const body = parse(await resp.text(), parserOptions)
  await assertSnapshot(t, body)
})
