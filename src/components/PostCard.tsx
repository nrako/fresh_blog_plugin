import Time from './Time.tsx'
import { PageFrontmatter } from 'https://esm.sh/v135/myst-frontmatter@1.1.23'

export default function PostCard(
  props: { url: string; frontmatter: PageFrontmatter; language: string },
) {
  const { url, frontmatter, language } = props
  return (
    <a className='freshBlog-postCard' href={url}>
      <article>
        <header>
          <h2>
            {frontmatter.title}
          </h2>
          {frontmatter.date &&
            <Time date={frontmatter.date} language={language} />}
        </header>
        <section>
          {frontmatter.description}
        </section>
      </article>
    </a>
  )
}
