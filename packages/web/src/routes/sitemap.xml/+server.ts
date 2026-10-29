import { getEventUrl } from '#lib/helpers/url.js'
import { sanityApi } from '#lib/sanity/client.js'
import type { NavigationItem } from '#lib/components/header/types.js'
import { ENABLE_CACHE } from '$app/env/private'
import type { RequestHandler } from './$types'

const origin = 'https://spanischer-verein.com'

/** Matches the `max-age` below, so a cached body is never staler than what a
 * client holding on to the same response would have. */
const cacheDuration = 60 * 60 * 1000

/** The rendered document, kept per server process. Crawlers hit this route in
 * bursts and the body only changes when Sanity content does. */
let cached: { body: string; expiresAt: number } | null = null

/** Routes that exist as files rather than as Sanity documents. */
const staticPaths = ['/', '/newsletter/register']

const flattenNavigation = (items: NavigationItem[]): string[] =>
	items.flatMap((item) => [item.href, ...flattenNavigation(item.children ?? [])])

const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')

/**
 * The overview on `/` only links the most recent events, so the sitemap is what
 * tells crawlers that the older ones exist at all. It replaces the former
 * `/archiv/<year>-<month>` pages as the entry point into the back catalogue.
 */
export const GET: RequestHandler = async () => {
	if (ENABLE_CACHE && cached && cached.expiresAt > Date.now()) return respond(cached.body)

	const [documents, navigationTree] = await Promise.all([
		sanityApi.getSitemapDocuments(),
		sanityApi.getNavigationTree(),
	])

	// Pages are reachable at their position in the navigation tree. Anything not
	// placed there — the imprint and privacy pages, typically — still resolves at
	// its bare slug, because `[...pageUrl]` matches on the last segment only.
	const pathBySlug = new Map(
		flattenNavigation(navigationTree).map((href) => [href.split('/').at(-1), href]),
	)

	const entries = [
		...staticPaths.map((path) => ({ path, lastmod: undefined })),
		...documents.pages.map(({ slug, updatedAt }) => ({
			path: pathBySlug.get(slug) ?? `/${slug}`,
			lastmod: updatedAt,
		})),
		...documents.events.map(({ slug, updatedAt }) => ({
			path: getEventUrl(slug),
			lastmod: updatedAt,
		})),
	]

	// A slug can appear both in the navigation tree and on its own; keep the
	// first entry for each path so no URL is listed twice.
	const deduplicated = [...new Map(entries.map((entry) => [entry.path, entry])).values()]

	const urls = deduplicated
		.map(({ path, lastmod }) => {
			const location = `<loc>${escapeXml(origin + path)}</loc>`
			const modified = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''

			return `\t<url>${location}${modified}</url>`
		})
		.join('\n')

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

	if (ENABLE_CACHE) cached = { body, expiresAt: Date.now() + cacheDuration }

	return respond(body)
}

const respond = (body: string) =>
	new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600',
		},
	})
