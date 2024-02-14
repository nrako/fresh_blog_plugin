export default function Time(
  props: { date: Date | string; language?: string },
) {
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
