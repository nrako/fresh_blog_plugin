import processor from '../utils/processor.ts'
import { assertSnapshot } from '$fresh/src/server/deps.ts'

const text = await Deno.readTextFile('./tests/fixture/markdown_features.md')

Deno.test('prodcue an expected HTML result', async (t) => {
  const html = await processor(text)
  await assertSnapshot(t, html)
})
