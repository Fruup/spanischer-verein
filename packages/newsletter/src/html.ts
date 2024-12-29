import { minify } from 'html-minifier'
import path from 'node:path'

export async function getHtmlForEmail(url: string) {
	const response = await fetch(url)
	let html = await response.text()

	/**
	 * Inline CSS
	 */

	const map: { [href: string]: Promise<string> } = {}

	html = html.replace(/<link[^h]+href="([^"]+)"[^>]*>/g, (match, href) => {
		if (href.startsWith('.')) {
			href = path.join(url, href.slice(1))
		}

		// Async load CSS
		map[href] = fetch(href)
			.then((r) => r.text())
			.then((css) => css)

		return `\{\{${href}\}\}`
	})

	for (const href in map) {
		const css = await map[href]
		html = html.replace(`\{\{${href}\}\}`, `<style data-href="${href}">${css}</style>`)
	}

	/**
	 * Minify HTML
	 */

	html = minify(html, {
		minifyCSS: true,
		removeComments: true,
		collapseWhitespace: true,
		preserveLineBreaks: false,
	})

	return html
}
