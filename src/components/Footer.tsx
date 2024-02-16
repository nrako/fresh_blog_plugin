import IconRss from 'https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/rss.tsx'

export default function Footer({ feedPathPrefix }: { feedPathPrefix: string }) {
  return (
    <footer class='freshBlog-footer'>
      <IconRss />
      <ul className='feed-links'>
        <li>
          <a href={`${feedPathPrefix}/atom`} title='Atom 1.0'>Atom</a>
        </li>
        <li>
          <a href={`${feedPathPrefix}/json`} title='JSON Feed 1.0'>JSON</a>
        </li>
        <li>
          <a href={`${feedPathPrefix}/rss`} title='RSS 2.0'>RSS</a>
        </li>
      </ul>
    </footer>
  )
}
