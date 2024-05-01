import { sanityApi } from '$lib/sanity/client'

export const load = async ({ params }) => {
	const year = parseInt(params.year) || new Date().getFullYear()
	const month = parseInt(params.month) || new Date().getMonth() + 1

	// Load event data.
	const events = await sanityApi.getEventsOverview({ year, month })

	return {
		events,
		year,
		month,
	}
}
