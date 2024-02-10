import processor from '../src/utils/processor.ts'
import { assertSnapshot } from '$fresh/src/server/deps.ts'
import { assertStringIncludes } from '$std/assert/assert_string_includes.ts'

const commonmarkMD = await Deno.readTextFile(
  './tests/fixture/specs/markdown_features.md',
)
const mystMD = await Deno.readTextFile('./tests/fixture/specs/myst_features.md')

Deno.test('produce the expected HTML result for CommonMark markdown', async (t) => {
  const html = await processor(commonmarkMD)
  await assertSnapshot(t, html)
})

Deno.test('produce the expected HTML result for MyST markdown', async (t) => {
  const html = await processor(mystMD)
  await assertSnapshot(t, html)
})

// TODO fix thix test, right now the link is not automatically formatted
// In the myst-cli this is handled here https://github.com/executablebooks/mystmd/blob/4d4116c59479f717bff456f5e3117584df9e1553/packages/myst-cli/src/transforms/dois.ts#L19-L32
Deno.test('transforms doi links for citations', { ignore: true }, async () => {
  const html = await processor('[](doi:10.5281/zenodo.6476040)')
  assertStringIncludes(
    html,
    '<a href="https://doi.org/10.5281/zenodo.6476040" rel="noopener">Cockett (2022)</a>',
  )
})

// TODO fix thix test, right now the admonition-title appear twice for unclear reason
Deno.test('transforms callouts (admonition) without double titles', {
  ignore: true,
}, async () => {
  const src = `:::{tip}
  Test Callout
  :::`
  const html = await processor(src)
  assertStringIncludes(
    html,
    '<aside class="admonition tip"><p class="admonition-title">Tip</p><p>Test Callout</p></aside>',
  )
})

// TODO fix thix test, right now the input is wrapped in an undesired paragraph block
Deno.test('transforms task list', { ignore: true }, async () => {
  const src = `- [ ] foo`
  const html = await processor(src)
  assertStringIncludes(
    html,
    '<ul class="contains-task-list"><li class="task-list-item"><input type="checkbox" disabled="">foo</li></ul>',
  )
})

// TODO fix thix test, AFAICT this should be supported by markdownit which is used by MyST
Deno.test('transforms GFM striketrough', { ignore: true }, async () => {
  const src = `~~Hi~~ Hello, ~there~ world!`
  const html = await processor(src)
  assertStringIncludes(
    html,
    '<p><del>Hi</del> Hello, <del>there</del> world!</p>',
  )
})
