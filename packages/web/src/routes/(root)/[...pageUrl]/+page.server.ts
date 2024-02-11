import { sanityApi } from '$lib/sanity/client.js'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const { pageUrl } = params

	const page = await sanityApi.getPage(pageUrl)
	if (!page) throw error(404, { errorCode: 'NOT_FOUND', message: 'Page not found' })

	return {
		page,
	}
}
