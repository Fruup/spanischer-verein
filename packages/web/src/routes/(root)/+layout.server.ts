import { sanityApi } from '$lib/sanity/client'
import { setLocale } from '$lib/services/locale'
import { pick } from '$lib/helpers/pick'
import { parseMonthFromUrl } from '$lib/helpers/url'

const cache: Record<string, any> = {}

export const load = async ({ request, params }) => {
	const locales = (request.headers.get('Accept-Language')?.split(',') ?? []).map((lang) => {
		const to = lang.indexOf(';')
		return lang.slice(0, to < 0 ? undefined : to)
	})

	if (locales[0]) setLocale(locales[0])

	const siteSettings = await sanityApi.getSiteSettings()

	const headerImages = siteSettings?.headerImageUrls ?? []
	const leftHeaderImageIndex = pick(headerImages ?? [])?.index ?? 0
	const rightHeaderImageIndex = pick(headerImages ?? [], [leftHeaderImageIndex])?.index ?? 0

	const pastHighlights = cache['pastHighlights'] || (await sanityApi.getPastHighlights())
	cache['pastHighlights'] = pastHighlights

	const { year, month } = parseMonthFromUrl(params)
	const events = await sanityApi.getEventsOverview({ year, month })

	return {
		locales,
		navigationTree: await sanityApi.getNavigationTree(),
		siteSettings,
		events,
		leftHeaderImageIndex,
		rightHeaderImageIndex,
		pastHighlights,
	}
}
