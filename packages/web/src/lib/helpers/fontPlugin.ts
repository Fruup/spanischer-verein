import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import arialMetrics from '@capsizecss/metrics/arial'

interface FontMetrics {
	ascent: number
	descent: number
	lineGap: number
	unitsPerEm: number
	xWidthAvg: number
}

/**
 * Downloads Google Fonts (the stylesheet and every font file it references) into
 * the static asset directory at startup and exposes the rewritten CSS as
 * `virtual:fonts.css`.
 *
 * The virtual module inlines the stylesheets rather than `@import`-ing them:
 * Tailwind 4 processes every CSS file in the graph and would try to resolve the
 * `/_fonts/...` paths as modules.
 *
 * It also generates, per family, a metric-matched `<Family> Fallback`
 * `@font-face` (local Arial, resized with `size-adjust`/`*-override` to the
 * webfont's own metrics) and exposes the single latin/weight-400 file to
 * preload as `virtual:fonts-preload`. Together these remove the layout jump
 * `font-display: swap` otherwise causes: the fallback occupies the same box
 * the webfont will, and the preload shortens the window before the swap.
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

		/** Every font file download, so startup can wait for all of them. */
		const downloads: Promise<void>[] = []

		for (const block of text.match(/@font-face\s*{[^}]*}/g) ?? []) {
			const urlMatch = block.match(/src:\s+url\(([^)]+)\)/)
			if (!urlMatch) continue

			const fontFileUrl = urlMatch[1]
			const filename = path.basename(fontFileUrl)
			const fontFilePath = path.join(publicDir, '_fonts', fontFamily, filename)

			downloads.push(downloadFontFile(fontFileUrl, fontFilePath))

			const href = encodeURI(joinUrl(baseUrl, '_fonts', fontFamily, filename))
			text = text.replace(urlMatch[0], `src: url('${href}')`)

			// The regular, non-italic, Latin-subset file is the one visible on
			// first paint for (German-covering) Latin text, so it is the one
			// worth preloading.
			const isPreloadCandidate =
				/font-weight:\s*400/.test(block) &&
				/font-style:\s*normal/.test(block) &&
				/U\+0000-00FF/.test(block)

			if (isPreloadCandidate) preloadHrefs.set(fontFamily, href)
		}

		// Without this the stylesheet can reference files that are still in
		// flight, so the first page load of a cold start gets no font at all.
		await Promise.all(downloads)

		text += await buildFallbackFontFace(fontFamily)

		const stylesheetPath = path.join(publicDir, '_fonts', fontFamily, 'index.css')
		fs.mkdirSync(path.dirname(stylesheetPath), { recursive: true })
		fs.writeFileSync(stylesheetPath, text)

		stylesheets.set(fontFamily, text)
	}

	/**
	 * A `<Family> Fallback` face: a local system font resized with
	 * `size-adjust` and the `*-override` properties so its box metrics match
	 * the webfont. Put in front of the real system fallback in a `font-family`
	 * list, it occupies the same space the webfont swaps into, so
	 * `font-display: swap` no longer causes a visible reflow.
	 */
	async function buildFallbackFontFace(fontFamily: string) {
		const key = toCapsizeMetricsKey(fontFamily)
		const metrics: FontMetrics = (await import(`@capsizecss/metrics/${key}`)).default

		// `xWidthAvg` is in font units, and the two fonts don't share a
		// `unitsPerEm`, so it has to be normalized to an em-relative value
		// before comparison — otherwise the ratio is off by `unitsPerEm`.
		const sizeAdjust =
			metrics.xWidthAvg / metrics.unitsPerEm / (arialMetrics.xWidthAvg / arialMetrics.unitsPerEm)
		const adjustedUnitsPerEm = metrics.unitsPerEm * sizeAdjust

		const pct = (n: number) => `${(n * 100).toFixed(2)}%`

		return `
/* Metric-matched fallback, computed from @capsizecss/metrics against Arial. */
@font-face {
	font-family: '${fontFamily} Fallback';
	src: local('Arial');
	size-adjust: ${pct(sizeAdjust)};
	ascent-override: ${pct(metrics.ascent / adjustedUnitsPerEm)};
	descent-override: ${pct(Math.abs(metrics.descent) / adjustedUnitsPerEm)};
	line-gap-override: ${pct(metrics.lineGap / adjustedUnitsPerEm)};
}
`
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

	/** family -> href of its regular, non-italic, Latin-subset file. */
	const preloadHrefs = new Map<string, string>()

	const virtualModuleId = 'virtual:fonts.css'
	const preloadVirtualModuleId = 'virtual:fonts-preload'

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

			if (source === preloadVirtualModuleId) {
				return '\0' + preloadVirtualModuleId
			}
		},
		load(id) {
			if (id === '\0' + virtualModuleId) {
				return [...stylesheets.values()].join('\n')
			}

			if (id === '\0' + preloadVirtualModuleId) {
				return `export default ${JSON.stringify([...preloadHrefs.values()])}`
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

/** `Bricolage Grotesque` -> `bricolageGrotesque`, matching @capsizecss/metrics's export names. */
function toCapsizeMetricsKey(familyName: string): string {
	const [first, ...rest] = familyName.split(' ')
	return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join('')
}

function joinUrl(...parts: string[]): string {
	let result = path.join(...parts)

	if (!result.startsWith('/')) {
		result = '/' + result
	}

	return result
}
