import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

/**
 * Downloads Google Fonts (the stylesheet and every font file it references) into
 * the static asset directory at startup and exposes the rewritten CSS as
 * `virtual:fonts.css`.
 *
 * The virtual module inlines the stylesheets rather than `@import`-ing them:
 * Tailwind 4 processes every CSS file in the graph and would try to resolve the
 * `/_fonts/...` paths as modules.
 */
export const fontPlugin = (options: { url: string | string[] }): Plugin => {
	async function processUrl(url: string) {
		if (!url.startsWith('https://fonts.googleapis.com/css2')) {
			throw new Error('Only Google Fonts are supported at the current time... Sorry!')
		}

		const family = new URL(url).searchParams.get('family')
		if (!family) {
			throw new Error(`Could not find the font family in the URL. (?family=<...>): ${url}`)
		}

		// `family` is either `Figtree` or `Figtree:ital,wght@0,300..900`. Only the
		// name goes in the directory path.
		const axesAt = family.indexOf(':')
		const fontFamily = axesAt === -1 ? family : family.slice(0, axesAt)

		const response = await fetch(url, {
			headers: {
				// Without this, not all fonts are returned.
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch font stylesheet (${response.status}): ${url}`)
		}

		let text = await response.text()

		const regex = /src:\s+url\(([^)]+)\)/g

		/** Every font file download, so startup can wait for all of them. */
		const downloads: Promise<void>[] = []

		Array.from(text.matchAll(regex))
			.toReversed()
			.forEach((match) => {
				const fontFileUrl = match[1]
				const location = [match.index, match.index + match[0].length]
				const filename = path.basename(fontFileUrl)
				const fontFilePath = path.join(publicDir, '_fonts', fontFamily, filename)

				downloads.push(downloadFontFile(fontFileUrl, fontFilePath))

				// replace
				text =
					text.slice(0, location[0]) +
					`src: url('${encodeURI(joinUrl(baseUrl, '_fonts', fontFamily, filename))}')` +
					text.slice(location[1])
			})

		// Without this the stylesheet can reference files that are still in
		// flight, so the first page load of a cold start gets no font at all.
		await Promise.all(downloads)

		const stylesheetPath = path.join(publicDir, '_fonts', fontFamily, 'index.css')
		fs.mkdirSync(path.dirname(stylesheetPath), { recursive: true })
		fs.writeFileSync(stylesheetPath, text)

		stylesheets.set(fontFamily, text)
	}

	async function downloadFontFile(url: string, destination: string) {
		// Google's font file names are content-addressed, so an existing file is
		// always the right one and a changed axis range yields a new name.
		if (fs.existsSync(destination)) return

		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch font file (${response.status}): ${url}`)
		}

		// `response.text()` would decode the woff2 as UTF-8 and replace every
		// byte sequence that isn't valid, which silently corrupts the font while
		// leaving its ASCII `wOF2` header intact.
		const bytes = new Uint8Array(await response.arrayBuffer())

		fs.mkdirSync(path.dirname(destination), { recursive: true })
		fs.writeFileSync(destination, bytes)
	}

	let publicDir = 'static'
	let baseUrl = '/'

	/** family -> rewritten `@font-face` CSS */
	const stylesheets = new Map<string, string>()

	const virtualModuleId = 'virtual:fonts.css'

	const urls = asArray(options.url)

	return {
		name: 'font-plugin',
		enforce: 'pre',
		config(config) {
			if (config.publicDir) {
				publicDir = config.publicDir
			}

			if (config.base) {
				baseUrl = config.base
			}
		},
		resolveId(source) {
			if (source === virtualModuleId) {
				return '\0' + virtualModuleId
			}
		},
		load(id) {
			if (id === '\0' + virtualModuleId) {
				return [...stylesheets.values()].join('\n')
			}
		},
		async options() {
			// This runs once on startup. A failure here has to be loud: swallowing
			// it leaves the site with a stylesheet pointing at files that are not
			// there, which looks like a font that simply does not apply.
			await Promise.all(urls.map(processUrl))
		},
	}
}

// Helper functions

function asArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [value]
}

function joinUrl(...parts: string[]): string {
	let result = path.join(...parts)

	if (!result.startsWith('/')) {
		result = '/' + result
	}

	return result
}
