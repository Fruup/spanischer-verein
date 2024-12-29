import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				accent: '#ef0000',
			},
		},
	},

	plugins: [typography],
} satisfies Config
