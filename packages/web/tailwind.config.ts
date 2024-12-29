import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				accent: {
					DEFAULT: '#ef0000',
					300: '#ff4d4d',
				},
			},
		},
	},

	plugins: [typography],
} satisfies Config
