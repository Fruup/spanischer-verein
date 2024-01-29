import { sanityApi } from '$lib/sanity/client'

export const load = async () => {
	return {
		events: await sanityApi.getUpcomingEventsOverview(),
	}
}
