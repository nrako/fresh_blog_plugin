import { type Config } from 'npm:tailwindcss'
import typographyPlugin from 'npm:@tailwindcss/typography'

export default {
  plugins: [typographyPlugin],
  content: [
    '{routes,islands,components}/**/*.{ts,tsx}',
    '../{routes,islands,components}/**/*.{ts,tsx}',
    '../tests/fixture/**/*.md', // this should match `options.contentDir`
  ],
} satisfies Config
