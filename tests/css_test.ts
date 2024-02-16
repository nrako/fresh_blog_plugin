import { assertEquals } from '$std/assert/assert_equals.ts'
import { type BlogOptions, postcssProcess } from '../mod.ts'
import { createFreshBlogHandler, runBuildExample } from './utils.ts'
import * as path from '$std/path/mod.ts'
import { exists } from '$std/fs/mod.ts'

const blogOptions: BlogOptions = {
  dev: true,
  contentDir: './tests/fixture/posts/',
}

Deno.test('serve the css', async () => {
  const handler = await createFreshBlogHandler(blogOptions)

  const resp = await handler(new Request('http://127.0.0.1/freshblog.css'))

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
  const source = await Deno.readTextFile(
    path.resolve(__dirname, '../src/styles.css'),
  )
  const css = await postcssProcess(source)

  assertEquals(await resp.text(), css)
  assertEquals(resp.headers.get('content-type'), 'text/css')
  assertEquals(
    resp.headers.get('cache-control'),
    'no-cache, no-store, max-age=0, must-revalidate',
  )
})

Deno.test('serve the css on the configured `cssFilename`', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    cssFilename: 'blog.css',
  })

  const resp = await handler(new Request('http://127.0.0.1/blog.css'))

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
  const source = await Deno.readTextFile(
    path.resolve(__dirname, '../src/styles.css'),
  )
  const css = await postcssProcess(source)

  assertEquals(await resp.text(), css)
  assertEquals(resp.headers.get('content-type'), 'text/css')
  assertEquals(
    resp.headers.get('cache-control'),
    'no-cache, no-store, max-age=0, must-revalidate',
  )
})

Deno.test('build the static css during build step', async () => {
  const buildResult = await runBuildExample()
  assertEquals(buildResult.code, 0)
  const staticCssExists = await exists('./example/_fresh/static/freshblog.css')
  assertEquals(staticCssExists, true)
})
