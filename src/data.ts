// Importing two new std lib functions to help with parsing front matter and joining file paths.
import { extract } from '$std/front_matter/yaml.ts'
import { extname, join } from '$std/path/mod.ts'
import processor, { ParseOptions } from './utils/processor.ts'

export interface Post {
  slug: string
  title: string
  date: Date
  content: string
  description: string
}

export async function getPosts(dir = './posts'): Promise<Post[]> {
  const files = Deno.readDir(dir)
  const promises = []
  for await (const fileOrFolder of files) {
    if (fileOrFolder.isDirectory) continue
    if (extname(fileOrFolder.name) !== '.md') continue
    const file = fileOrFolder
    const slug = file.name.replace('.md', '')
    promises.push(getPost(dir, slug))
  }
  const posts = await Promise.all(promises) as Post[]
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  return posts
}

export async function getPost(
  dir = './posts',
  slug: string,
  options?: ParseOptions,
): Promise<Post | null> {
  try {
    const text = await Deno.readTextFile(join(dir, `${slug}.md`))
    const { attrs, body } = extract<Partial<Post>>(text)

    const content = await processor(body, options)

    return {
      slug,
      title: attrs.title ?? '',
      date: new Date(attrs.date ?? ''),
      content,
      description: attrs.description ?? '',
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null
    }

    throw error
  }
}
