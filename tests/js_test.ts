import { assertEquals } from '$std/assert/assert_equals.ts'
import { type BlogOptions } from '../mod.ts'
import { createFreshBlogHandler, runBuildExample } from './utils.ts'
import * as path from '$std/path/mod.ts'
import { exists } from '$std/fs/mod.ts'

const blogOptions: BlogOptions = {
  dev: true,
  contentDir: './tests/fixture/posts/',
}

Deno.test('serve the js', async () => {
  const handler = await createFreshBlogHandler(blogOptions)

  const resp = await handler(new Request('http://127.0.0.1/freshblog.js'))

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
  const source = await Deno.readTextFile(
    path.resolve(__dirname, '../src/client.js'),
  )
  assertEquals(await resp.text(), source)
  assertEquals(resp.headers.get('content-type'), 'text/javascript')
  assertEquals(
    resp.headers.get('cache-control'),
    'no-cache, no-store, max-age=0, must-revalidate',
  )
})

Deno.test('serve the js on the configured `jsFilename`', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    jsFilename: 'blog.js',
  })

  const resp = await handler(new Request('http://127.0.0.1/blog.js'))

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
  const source = await Deno.readTextFile(
    path.resolve(__dirname, '../src/client.js'),
  )
  assertEquals(await resp.text(), source)
  assertEquals(resp.headers.get('content-type'), 'text/javascript')
  assertEquals(
    resp.headers.get('cache-control'),
    'no-cache, no-store, max-age=0, must-revalidate',
  )
})

Deno.test('build the static JS file during build step', async () => {
  const buildResult = await runBuildExample()
  assertEquals(buildResult.code, 0)
  const staticJSExists = await exists('./example/_fresh/static/freshblog.js')
  assertEquals(staticJSExists, true)
})
