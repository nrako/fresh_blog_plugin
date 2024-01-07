import processor from '../utils/processor.ts'
import { assertSnapshot } from '$fresh/src/server/deps.ts'

const commonmarkMD = await Deno.readTextFile('./tests/fixture/markdown_features.md')
const mystMD = await Deno.readTextFile('./tests/fixture/myst_features.md')

Deno.test('produce the expected HTML result for CommonMark markdown', async (t) => {
  const html = await processor(commonmarkMD)
  await assertSnapshot(t, html)
})

Deno.test('produce the expected HTML result for MyST markdown', async (t) => {
  const html = await processor(mystMD)
  await assertSnapshot(t, html)
})