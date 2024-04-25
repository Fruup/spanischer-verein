import { sanityApi } from '$lib/sanity/client'
import { setLocale } from '$lib/services/locale'
import { pick } from '$lib/helpers/pick'

export const load = async ({ request, url }) => {
	const locales = (request.headers.get('Accept-Language')?.split(',') ?? []).map((lang) => {
		const to = lang.indexOf(';')
		return lang.slice(0, to < 0 ? undefined : to)
	})

	if (locales[0]) setLocale(locales[0])

	// const [yearString, monthString] = url.searchParams.get('t')?.split('-') ?? []
	// const year = parseInt(yearString) || new Date().getFullYear()
	// const month = parseInt(monthString) || new Date().getMonth() + 1

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1

	const siteSettings = await sanityApi.getSiteSettings()

	const headerImages = siteSettings?.headerImageUrls ?? []
	const leftHeaderImageIndex = pick(headerImages ?? [])?.index ?? 0
	const rightHeaderImageIndex = pick(headerImages ?? [], [leftHeaderImageIndex])?.index ?? 0

	return {
		locales,
		navigationTree: await sanityApi.getNavigationTree(),
		siteSettings,
		events: await sanityApi.getEventsOverview({ year, month }),
		leftHeaderImageIndex,
		rightHeaderImageIndex,
		// year,
		// month,
	}
}
