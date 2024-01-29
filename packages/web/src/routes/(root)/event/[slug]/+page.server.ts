import { sanityApi } from '$lib/sanity/client'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const event = await sanityApi.getEvent(params.slug)

	if (!event) throw error(404, { errorCode: 'NOT_FOUND', message: 'Event not found' })

	return {
		event,
	}
}
