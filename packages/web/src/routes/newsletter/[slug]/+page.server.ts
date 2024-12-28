import { sanityApi } from '$lib/sanity/client'
import { error } from '@sveltejs/kit'

export const csr = false

export const load = async ({ params }) => {
	const newsletter = await sanityApi.getNewsletter(params.slug)
	if (!newsletter)
		throw error(404, {
			errorCode: 'NOT_FOUND',
			message: 'Newsletter not found',
		})

	return {
		newsletter,
	}
}
