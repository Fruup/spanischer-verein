import { sanityApi } from '$lib/sanity/client'
import { setLocale } from '$lib/services/locale'
import { pick } from '$lib/helpers/pick'
import { parseMonthFromUrl } from '$lib/helpers/url'

export const load = async ({ request, params }) => {
	const locales = (request.headers.get('Accept-Language')?.split(',') ?? []).map((lang) => {
		const to = lang.indexOf(';')
		return lang.slice(0, to < 0 ? undefined : to)
	})

	if (locales[0]) setLocale(locales[0])

	// Start all API calls in parallel
	const siteSettingsPromise = sanityApi.getSiteSettings()
	const pastHighlightsPromise = sanityApi.getPastHighlights()
	const eventsPromise = sanityApi.getEventsOverview(parseMonthFromUrl(params))
	const navigationTreePromise = sanityApi.getNavigationTree()

	const siteSettings = await siteSettingsPromise
	const headerImages = siteSettings?.headerImageUrls ?? []
	const leftHeaderImageIndex = pick(headerImages ?? [])?.index ?? 0
	const rightHeaderImageIndex = pick(headerImages ?? [], [leftHeaderImageIndex])?.index ?? 0

	return {
		locales,
		navigationTree: await navigationTreePromise,
		siteSettings,
		events: await eventsPromise,
		leftHeaderImageIndex,
		rightHeaderImageIndex,
		pastHighlights: await pastHighlightsPromise,
	}
}
