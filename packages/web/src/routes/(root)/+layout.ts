import { sanityApi } from '$lib/sanity/client'

export const load = async () => {
	return {
		upcomingEvents: await sanityApi.getUpcomingEventsOverview(),
	}
}
