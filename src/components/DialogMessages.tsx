import { Messages } from '../utils/processor.ts'

export default function DialogMessages(
  { slug, messages }: {
    slug: string
    messages: Messages
  },
) {
  if (
    !messages.errors?.length && !messages.warnings?.length
  ) return null

  return (
    <dialog
      role='alertdialog'
      open
      className='max-w-screen-md mx-auto bg-red-50 p-4 shadow-lg mt-4'
    >
      {messages.errors && (
        <dl class='text-red-600'>
          {messages.errors?.map((error) => (
            <>
              <dt>🚫 {error.property}</dt>
              <dd>{error.message}</dd>
            </>
          ))}
        </dl>
      )}
      {messages.warnings && (
        <dl class='text-yellow-800'>
          {messages.warnings?.map((warning) => (
            <>
              <dt>⚠️ {warning.property}</dt>
              <dd>{warning.message}</dd>
            </>
          ))}
        </dl>
      )}
      <form method='dialog'>
        <button>Close</button>
      </form>
    </dialog>
  )
}
