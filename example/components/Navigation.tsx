export default function Navigation({ class: c }: { class: string }) {
  return (
    <nav class={c}>
      <ul class='flex gap-4'>
        <li>
          <a href='/' title='Home'>Home</a>
        </li>
        <li>
          <a href='/blog' title='Blog'>Blog</a>
        </li>
        <li>
          <a href='/specs' title='Specs'>Specs</a>
        </li>
      </ul>
    </nav>
  )
}
