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

		let fontFamily = new URL(url).searchParams.get('family')!
		if (!fontFamily) {
			throw new Error('Could not find the font family in the URL. (?family=<...>)')
		}
		fontFamily = fontFamily.slice(0, fontFamily.indexOf(':'))

		let text = await fetch(url, {
			headers: {
				// Without this, not all fonts are returned.
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
			},
		}).then((response) => response.text())

		const regex = /src:\s+url\(([^\)]+)\)/g

		Array.from(text.matchAll(regex))
			.toReversed()
			.forEach((match) => {
				const fontFileUrl = match[1]
				const location = [match.index, match.index + match[0].length]
				const filename = path.basename(fontFileUrl)

				fetch(fontFileUrl).then(async (response) => {
					if (!response.ok) {
						throw new Error(`Failed to fetch font file: ${fontFileUrl}`)
					}

					const fontFile = await response.text()
					const fontFilePath = path.join(publicDir, '_fonts', fontFamily, filename)

					// save font file
					fs.mkdirSync(path.dirname(fontFilePath), { recursive: true })
					fs.writeFileSync(fontFilePath, fontFile)
				})

				// replace
				text =
					text.slice(0, location[0]) +
					`src: url('${encodeURI(joinUrl(baseUrl, '_fonts', fontFamily, filename))}')` +
					text.slice(location[1])
			})

		const fontFilePath = path.join(publicDir, '_fonts', fontFamily, 'index.css')
		fs.mkdirSync(path.dirname(fontFilePath), { recursive: true })
		fs.writeFileSync(fontFilePath, text)

		stylesheets.set(fontFamily, text)
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
			// This runs once on startup.
			await Promise.allSettled(urls.map(processUrl))
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
