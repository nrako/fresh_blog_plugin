import { type BlogOptions, defaultOptions } from '../mod.ts'
import { getPost, getPosts } from '../src/data.ts'

const blogOptions: Required<BlogOptions> = {
  ...defaultOptions,
  contentDir: './tests/fixture/specs/',
  feedPathPrefix: '',
}

Deno.bench('`getPosts` no cache', { group: 'getPosts' }, async (b) => {
  await Deno.remove('tests/fixture/specs/.cache', { recursive: true })
  b.start()
  await getPosts(blogOptions)
  b.end()
})

Deno.bench(
  '`getPosts` with cache',
  { group: 'getPosts', baseline: true },
  async (b) => {
    await getPosts(blogOptions)
    b.start()
    await getPosts(blogOptions)
    b.end()
  },
)

Deno.bench('`getPost` no cache', { group: 'getPost' }, async (b) => {
  await Deno.remove('tests/fixture/specs/.cache', { recursive: true })
  b.start()
  await getPost('myst_features', blogOptions)
  b.end()
})

Deno.bench(
  '`getPost` with cache',
  { group: 'getPost', baseline: true },
  async (b) => {
    await getPost('myst_features', blogOptions)
    b.start()
    await getPost('myst_features', blogOptions)
    b.end()
  },
)
