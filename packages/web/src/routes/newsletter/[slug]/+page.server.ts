import { SANITY_TOKEN } from '$env/static/private'
import { isRenderingNewsletter } from '$lib/config'
import { sanityApi } from '$lib/sanity/client'
import { error } from '@sveltejs/kit'

export const prerender = isRenderingNewsletter

export const load = async ({ params }) => {
	console.log('SANITY_TOKEN', SANITY_TOKEN)
	const event = await sanityApi.getEvent(params.slug)

	if (!event) throw error(404, { errorCode: 'NOT_FOUND', message: 'Event not found' })

	return {
		event,
	}
}
