export default function Time(props: { date: Date; language?: string }) {
  const { date, language } = props
  return (
    <time>
      {new Date(date).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}
