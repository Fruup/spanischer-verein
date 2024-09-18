import type { HtmlTagDescriptor, Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

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

					const fontFile = await (await response.blob()).bytes()
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

		fontFamilies.push(fontFamily)
	}

	let publicDir = 'public'
	let baseUrl = '/'
	const fontFamilies: string[] = []

	const virtualModuleId = 'virtual:fonts.css'

	const urls = asArray(options.url)

	return {
		name: 'font-plugin',
		enforce: 'post',
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
				return fontFamilies
					.map((fontFamily) => `@import '${joinUrl(baseUrl, '_fonts', fontFamily, 'index.css')}';`)
					.join('\n')
			}
		},
		transformIndexHtml: {
			order: 'post',
			handler(html) {
				console.log(html)

				return fontFamilies.map(
					(fontFamily) =>
						({
							tag: 'link',
							attrs: {
								rel: 'stylesheet',
								href: joinUrl(baseUrl, '_fonts', fontFamily, 'index.css'),
							},
							injectTo: 'head-prepend',
						}) satisfies HtmlTagDescriptor,
				)
			},
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
