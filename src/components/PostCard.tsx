import Time from './Time.tsx'
import { PageFrontmatter } from 'https://esm.sh/v135/myst-frontmatter@1.1.23'

export default function PostCard(
  props: { url: string; frontmatter: PageFrontmatter; language: string },
) {
  const { url, frontmatter, language } = props
  return (
    <div class='py-8 border(t gray-200)'>
      <a class='sm:col-span-2' href={url}>
        <h3 class='text(3xl gray-900) font-bold'>
          {frontmatter.title}
        </h3>
        {frontmatter.date &&
          <Time date={frontmatter.date} language={language} />}
        <div class='mt-4 text-gray-900'>
          {frontmatter.description}
        </div>
      </a>
    </div>
  )
}
