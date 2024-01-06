import IconRss from 'https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/rss.tsx'

export default function Footer({ feedPathPrefix }: { feedPathPrefix: string }) {
  return (
    <footer class='mb-20 flex items-center max-w-screen-md px-4 pt-16 mx-auto gap-2 text-sm opacity-70'>
      <IconRss class='h-4 w-4' />
      <div class='flex justify-center gap-2'>
        <a href={`${feedPathPrefix}/atom`} title='Atom 1.0'>Atom</a>
        |
        <a href={`${feedPathPrefix}/json`} title='JSON Feed 1.0'>JSON</a>
        |
        <a href={`${feedPathPrefix}/rss`} title='RSS 2.0'>RSS</a>
      </div>
    </footer>
  )
}
