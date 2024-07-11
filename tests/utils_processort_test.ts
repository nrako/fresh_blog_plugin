import processor from '../src/utils/processor.ts'
import { assertSnapshot } from '$fresh/src/server/deps.ts'
import { assertStringIncludes } from '$std/assert/assert_string_includes.ts'
import { assertEquals } from '$std/assert/assert_equals.ts'
import { defaultOptions } from '../mod.ts'

const commonmarkMD = await Deno.readTextFile(
  './tests/fixture/specs/markdown_features.md',
)
const mystMD = await Deno.readTextFile('./tests/fixture/specs/myst_features.md')

Deno.test('produce the expected metadata & HTML result for CommonMark markdown', async (t) => {
  const result = await processor(commonmarkMD)
  await assertSnapshot(t, result)
})

Deno.test('produce the expected metadata & HTML result for MyST markdown', async (t) => {
  const result = await processor(mystMD)
  await assertSnapshot(t, result)
})

Deno.test('return validation errors and warning messages of frontmatter', async () => {
  const src = `---
  date: invalid
  ---`
  const { messages } = await processor(src)
  assertEquals(messages, {
    errors: [
      {
        message:
          `'date' invalid date "invalid" - must be ISO 8601 format or IETF timestamp (at frontmatter)`,
        property: 'date',
      },
    ],
  })
})

Deno.test('prevents duplication of the title when set in both frontmatter and the content', async () => {
  const src = `---
  title: Title
  ---

  # Title

  Start of content.
  `
  const { frontmatter, html } = await processor(src)
  assertEquals(frontmatter, {
    title: 'Title',
    content_includes_title: false,
  })
  assertEquals(html, '<div class="block"><p>Start of content.</p></div>')
})

Deno.test('returns `options.defaultAuthors` or frontmatter `authors` if set', async () => {
  const options = {
    ...defaultOptions,
    defaultAuthors: [
      {
        name: 'Henri Li',
      },
    ],
  }
  const { frontmatter: emptyFrontmatter } = await processor('', options)
  assertEquals(emptyFrontmatter, {
    authors: [
      {
        id: 'contributors-generated-uid-0',
        name: 'Henri Li',
        nameParsed: {
          family: 'Li',
          given: 'Henri',
          literal: 'Henri Li',
        },
      },
    ],
  })
  const src = `---
  authors:
    - name: Abdoulaye Schmidt
  ---
  `
  const { frontmatter } = await processor(src, options)
  assertEquals(frontmatter, {
    authors: [
      {
        id: 'contributors-generated-uid-0',
        name: 'Abdoulaye Schmidt',
        nameParsed: {
          family: 'Schmidt',
          given: 'Abdoulaye',
          literal: 'Abdoulaye Schmidt',
        },
      },
    ],
  })
})

// TODO fix thix test, right now the link is not automatically formatted
// In the myst-cli this is handled here https://github.com/executablebooks/mystmd/blob/4d4116c59479f717bff456f5e3117584df9e1553/packages/myst-cli/src/transforms/dois.ts#L19-L32
Deno.test('transforms doi links for citations', { ignore: true }, async () => {
  const { html } = await processor('[](doi:10.5281/zenodo.6476040)')
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
  const { html } = await processor(src)
  assertStringIncludes(
    html,
    '<aside class="admonition tip"><p class="admonition-title">Tip</p><p>Test Callout</p></aside>',
  )
})

// TODO fix thix test, right now the input is wrapped in an undesired paragraph block
Deno.test('transforms task list', { ignore: true }, async () => {
  const src = `- [ ] foo`
  const { html } = await processor(src)
  assertStringIncludes(
    html,
    '<ul class="contains-task-list"><li class="task-list-item"><input type="checkbox" disabled="">foo</li></ul>',
  )
})

// TODO fix thix test, AFAICT this should be supported by markdownit which is used by MyST
Deno.test('transforms GFM striketrough', { ignore: true }, async () => {
  const src = `~~Hi~~ Hello, ~there~ world!`
  const { html } = await processor(src)
  assertStringIncludes(
    html,
    '<p><del>Hi</del> Hello, <del>there</del> world!</p>',
  )
})
