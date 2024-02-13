import { sanityApi } from '$lib/sanity/client'
import { setLocale } from '$lib/services/locale.js'

export const load = async ({ request }) => {
	const locales = (request.headers.get('Accept-Language')?.split(',') ?? []).map((lang) => {
		const to = lang.indexOf(';')
		return lang.slice(0, to < 0 ? undefined : to)
	})

	if (locales[0]) setLocale(locales[0])

	return {
		locales,
		upcomingEvents: await sanityApi.getUpcomingEventsOverview(),
		navigationTree: await sanityApi.getNavigationTree(),
		siteSettings: await sanityApi.getSiteSettings(),
	}
}
