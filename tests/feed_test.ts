import { assertSnapshot } from '$fresh/src/server/deps.ts'
import type { InternalOptions } from '../mod.ts'
import { createFreshBlogHandler } from './utils.ts'
import { parse } from 'https://deno.land/x/xml@2.1.3/mod.ts'
import type { ParserOptions } from 'https://deno.land/x/xml@2.1.3/utils/types.ts'

const blogOptions: Partial<InternalOptions> = {
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

  // We don't assert the html content, this is covered in tests for the processor
  // @ts-ignore-next-line
  body.feed.entry.forEach((entry) =>
    entry.content['#text'] = '<!-- HTML CONTENT -->'
  )

  await assertSnapshot(t, body)
})

Deno.test('JSON Feed 1.0 feed match snapshot', async (t) => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request('http://127.0.0.1/blog/json'),
  )
  const body = JSON.parse(await resp.text())

  // We don't assert the html content, this is covered in tests for the processor
  // @ts-ignore-next-line
  body.items.forEach((item) => item.content_html = '<!-- HTML CONTENT -->')

  await assertSnapshot(t, body)
})

Deno.test('RSS 2.0 feed match snapshot', async (t) => {
  const handler = await createFreshBlogHandler(blogOptions)
  const resp = await handler(
    new Request('http://127.0.0.1/blog/rss'),
  )
  const body = parse(await resp.text(), parserOptions)

  // We don't assert the html content, this is covered in tests for the processor
  // @ts-ignore-next-line
  body.rss.channel.item.forEach((item) =>
    item['content:encoded'] = '<!-- HTML CONTENT -->'
  )

  await assertSnapshot(t, body)
})
