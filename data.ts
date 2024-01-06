// Importing two new std lib functions to help with parsing front matter and joining file paths.
import { extract } from '$std/front_matter/yaml.ts'
import { join } from '$std/path/mod.ts'

export interface Post {
  slug: string
  title: string
  date: Date
  content: string
  description: string
  enableTeX: boolean
}

export async function getPosts(dir = './posts'): Promise<Post[]> {
  const files = Deno.readDir(dir)
  const promises = []
  for await (const file of files) {
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
): Promise<Post | null> {
  try {
    const text = await Deno.readTextFile(join(dir, `${slug}.md`))
    const { attrs, body } = extract<Partial<Post>>(text)
    return {
      slug,
      title: attrs.title ?? '',
      date: new Date(attrs.date ?? ''),
      content: body,
      description: attrs.description ?? '',
      enableTeX: attrs.enableTeX ?? false,
    }
  } catch {
    return null
  }
}
