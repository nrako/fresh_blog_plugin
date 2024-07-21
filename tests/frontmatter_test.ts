import type { BlogOptions } from '../mod.ts'
import { assertEquals, assertExists, assertStringIncludes } from '@std/assert'
import {
  createFreshBlogHandler,
  docForPath,
  findPopoverByHeadingText,
  getDefinitionList,
} from './utils.ts'

const blogOptions: BlogOptions = {
  contentDir: './tests/fixture/frontmatter/',
}

Deno.test('displays authors in posts feed if `options.showAuthors` is set to `always`', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    contentDir: './tests/fixture/posts/',
    showAuthors: 'always',
  })
  const doc = await docForPath(handler, '/blog')
  const blogLinks = doc?.querySelectorAll('main a[href^="/blog/"] article h3')
  assertStringIncludes(blogLinks[0].textContent, 'John Doe')
  assertStringIncludes(blogLinks[1].textContent, 'Ami Li')
})

Deno.test('never displays author in post if `options.showAuthors` is set to `never`', async () => {
  const handler = await createFreshBlogHandler({
    ...blogOptions,
    showAuthors: 'never',
  })
  const doc = await docForPath(handler, '/blog/supported')
  const postAuthor = doc?.querySelector('main a[href^="/blog/"] article h3')
  assertEquals(postAuthor, null)
})

Deno.test('displays author in post by default when `options.showAuthors` is not set', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog/supported')
  const postAuthor = doc?.querySelector('body article header h3')
  assertStringIncludes(postAuthor?.textContent || '', 'John Doe')
})

Deno.test('displays all author supported fields', async () => {
  const handler = await createFreshBlogHandler(blogOptions)
  const doc = await docForPath(handler, '/blog/supported')

  const johnDoePopover = findPopoverByHeadingText(doc, 'John Doe')
  assertExists(johnDoePopover)
  const johnDoeDetails = getDefinitionList(johnDoePopover, 'dl')
  assertEquals(johnDoeDetails, [
    // TODO this should not require `corresponding: true` when the author author has `corresponding: false`
    ['Email', 'john.doe@domain.tld'],
    ['Orcid', '0009-0000-4276-4816'],
    ['Twitter', '@colorize_bot'],
  ])

  const noCorrespondingPopover = findPopoverByHeadingText(
    doc,
    'No Corresponding',
  )
  assertExists(noCorrespondingPopover)
  const ncDetails = getDefinitionList(noCorrespondingPopover, 'dl')
  assertEquals(ncDetails, [])
})
