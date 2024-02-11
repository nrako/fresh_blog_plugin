// Importing two new std lib functions to help with parsing front matter and joining file paths.
import { extract } from '$std/front_matter/yaml.ts'
import { extname, join } from '$std/path/mod.ts'
import processor from './utils/processor.ts'
import { ensureDir, exists } from '$std/fs/mod.ts'
import { crypto } from '$std/crypto/mod.ts'
import { encodeHex } from '$std/encoding/hex.ts'
import { BlogOptions } from '../mod.ts'

export interface Post {
  slug: string
  title: string
  date: Date
  content: string
  description: string
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

export async function getPosts(
  options: Required<BlogOptions>,
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
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  return posts
}

export async function getPost(
  slug: string,
  options: Required<BlogOptions>,
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
        date: new Date(metadata.date),
        content: html,
      }
    }
  }

  const text = await Deno.readTextFile(join(options.contentDir, `${slug}.md`))
  const { attrs, body } = extract<Partial<Post>>(text)
  const content = await processor(body, options)

  const metadata = {
    slug,
    title: attrs.title ?? '',
    date: new Date(attrs.date ?? ''),
    description: attrs.description ?? '',
  }

  // Cleanup outdated cache file if any
  if (manifest[slug]) {
    await cleanupCacheFiles(cacheDir, slug, manifest[slug])
  }

  await ensureDir(cacheDir) // Ensure cache directory exists
  await Deno.writeTextFile(
    join(cacheDir, `${slug}-${currentHash}.html`),
    content,
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
    content,
  }
}
