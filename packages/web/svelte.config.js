import adapterStatic from '@sveltejs/adapter-static'
import adapterNetlify from '@sveltejs/adapter-netlify'
import preprocess from 'svelte-preprocess'
import { preprocessMeltUI, sequence } from '@melt-ui/pp'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

/**
 * @param {string} path
 */
const resolve = (path) => join(dirname(fileURLToPath(import.meta.url)), path)

const isRenderingNewsletter = process.env.PUBLIC_RENDERING_NEWSLETTER === 'true'
const newsletterSlug = process.env.NEWSLETTER_SLUG

const adapter = (() => {
	if (isRenderingNewsletter) {
		if (!newsletterSlug) throw Error("Missing env var 'NEWSLETTER_SLUG'")

		console.info(`ℹ️ Rendering newsletter with slug: ${newsletterSlug}`)

		return adapterStatic({
			strict: false,
		})
	} else {
		return adapterNetlify({})
	}
})()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		preprocess({
			scss: {
				includePaths: [resolve('src/lib/styles')],
			},
		}),
		preprocessMeltUI(),
	]),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter,

		outDir: isRenderingNewsletter ? 'newsletter' : undefined,
		prerender: {
			crawl: false,
			entries: isRenderingNewsletter ? ['/newsletter/' + newsletterSlug] : undefined,
		},

		alias: {
			$assets: 'src/assets',
		},
	},
}

export default config
