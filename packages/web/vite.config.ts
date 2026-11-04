import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import adapterNode from '@sveltejs/adapter-node'
import { imagetools } from 'vite-imagetools'
import { sveltekit } from '@sveltejs/kit/vite'
import { fontPlugin } from './src/lib/helpers/fontPlugin.js'

export default defineConfig({
	plugins: [
		fontPlugin({
			url: [
				'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap',
				'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap',
			],
		}),
		tailwindcss(),

		// SvelteKit 3 no longer reads `svelte.config.js` — the former contents of
		// that file are passed to the Vite plugin instead.
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,

				// `await` in deriveds, template expressions and at the top level of
				// components. Used to render remote `query` results during SSR.
				experimental: { async: true },
			},

			adapter: adapterNode({}),

			experimental: {
				// `*.remote.ts` files replace the `+page.server.ts` loads of v1.
				remoteFunctions: true,
			},
		}),

		imagetools(),
	],
	server: {
		watch: { ignored: [import.meta.dirname + '/.cache/**/*'] },
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
		],
	},
})
