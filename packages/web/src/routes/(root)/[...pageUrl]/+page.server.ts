import { sanityApi } from '$lib/sanity/client.js'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const { pageUrl } = params

	const pageSlug = pageUrl.split('/').at(-1)
	if (!pageSlug) throw error(404, { errorCode: 'NOT_FOUND', message: 'No page slug in URL' })

	const page = await sanityApi.getPage(pageUrl)
	if (!page) throw error(404, { errorCode: 'NOT_FOUND', message: 'Page not found' })

	return {
		page,
	}
}
