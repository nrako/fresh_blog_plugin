// Importing two new std lib functions to help with parsing front matter and joining file paths.
import { extname, join } from '$std/path/mod.ts'
import processor from './utils/processor.ts'
import { ensureDir, exists } from '$std/fs/mod.ts'
import { crypto } from '$std/crypto/mod.ts'
import { encodeHex } from '$std/encoding/hex.ts'
import { type InternalOptions } from '../mod.ts'
import { type PageFrontmatter } from '../deps.ts'
import { Messages } from './utils/processor.ts'

export interface Post {
  /** slug of the post, derived from the filename */
  slug: string
  frontmatter: PageFrontmatter
  /** HTML content of the post */
  content: string
  messages: Messages
}

type Hash = string
interface CacheManifest {
  [key: string]: Hash
}

interface ManifestEntry {
  hash: string
  cacheFile: string
}

async function getHashForFile(filePath: string): Promise<Hash> {
  const file = await Deno.readFile(filePath)
  const fileHashBuffer = await crypto.subtle.digest('SHA-256', file)
  return encodeHex(fileHashBuffer)
}

async function readManifest(cacheDir: string): Promise<CacheManifest> {
  const manifestPath = join(cacheDir, 'manifest.json')
  if (await exists(manifestPath)) {
    const manifestContent = await Deno.readTextFile(manifestPath)
    return JSON.parse(manifestContent)
  }
  return {}
}

async function writeManifest(
  cacheDir: string,
  manifest: CacheManifest,
): Promise<void> {
  await ensureDir(cacheDir) // Ensure cache directory exists
  const manifestPath = join(cacheDir, 'manifest.json')
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2))
}

async function cleanupCacheFiles(
  cacheDir: string,
  slug: string,
  hash: Hash,
): Promise<void> {
  const htmlCacheFilePath = join(cacheDir, `${slug}-${hash}.html`)
  const metadataCacheFilePath = join(cacheDir, `${slug}-${hash}.json`)
  if (await exists(htmlCacheFilePath)) {
    await Deno.remove(htmlCacheFilePath)
  }
  if (await exists(metadataCacheFilePath)) {
    await Deno.remove(metadataCacheFilePath)
  }
}

/**
 * `getPosts` returns all the posts at the given `options.contentDir`
 *
 * @todo support paginations
 *
 * @export
 * @async
 * @param {InternalOptions} options
 * @returns {Promise<Post[]>}
 */
export async function getPosts(
  options: InternalOptions,
): Promise<Post[]> {
  const files = Deno.readDir(options.contentDir)
  const promises = []
  for await (const fileOrFolder of files) {
    if (fileOrFolder.isDirectory) continue
    if (extname(fileOrFolder.name) !== '.md') continue
    const file = fileOrFolder
    const slug = file.name.replace('.md', '')
    promises.push(getPost(slug, options))
  }
  const posts = await Promise.all(promises) as Post[]
  posts.sort((a, b) =>
    Date.parse(b.frontmatter.date ?? '') - Date.parse(a.frontmatter.date ?? '')
  )
  return posts
}

/**
 * `getPost` returns a post located in `options.contentDir` for the given `slug`
 *
 * @export
 * @async
 * @param {string} slug
 * @param {InternalOptions} options
 * @returns {Promise<Post | null>}
 */
export async function getPost(
  slug: string,
  options: InternalOptions,
): Promise<Post | null> {
  const cacheDir = join(options.contentDir, '.cache')
  const filePath = join(options.contentDir, `${slug}.md`)
  if (!(await exists(filePath))) return null

  const currentHash = await getHashForFile(filePath)
  const manifest = await readManifest(cacheDir)

  if (manifest[slug] === currentHash) {
    // Serve cached HTML content if hash matches
    const cachedHtmlPath = join(cacheDir, `${slug}-${manifest[slug]}` + '.html')
    const cachedMetadataPath = join(
      cacheDir,
      `${slug}-${manifest[slug]}` + '.json',
    )

    if (await exists(cachedHtmlPath) && await exists(cachedMetadataPath)) {
      const html = await Deno.readTextFile(cachedHtmlPath)
      const json = await Deno.readTextFile(cachedMetadataPath)

      const metadata = JSON.parse(json)
      return {
        ...metadata,
        content: html,
      }
    }
  }

  const text = await Deno.readTextFile(join(options.contentDir, `${slug}.md`))
  const { frontmatter, html, messages } = await processor(text, options)

  const metadata: Omit<Post, 'content'> = {
    slug,
    frontmatter,
    messages,
  }

  // Cleanup outdated cache file if any
  if (manifest[slug]) {
    await cleanupCacheFiles(cacheDir, slug, manifest[slug])
  }

  await ensureDir(cacheDir) // Ensure cache directory exists
  await Deno.writeTextFile(
    join(cacheDir, `${slug}-${currentHash}.html`),
    html,
  )
  await Deno.writeTextFile(
    join(cacheDir, `${slug}-${currentHash}.json`),
    JSON.stringify(metadata),
  )

  // Update manifest
  manifest[slug] = currentHash
  await writeManifest(cacheDir, manifest)

  return {
    ...metadata,
    content: html,
  }
}
