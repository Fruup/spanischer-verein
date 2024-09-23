import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { imagetools } from 'vite-imagetools'
import { fontPlugin } from './src/lib/helpers/fontPlugin'

export default defineConfig({
	plugins: [
		fontPlugin({
			url: [
				'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
				'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
			],
		}),
		sveltekit(),
		imagetools(),
	],
	test: {
		include: ['**/*.test.ts'],
	},
})
