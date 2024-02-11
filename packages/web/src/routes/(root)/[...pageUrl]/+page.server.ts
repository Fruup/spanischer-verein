import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const { pageUrl } = params

	// pageUrl.split('/')...

	throw error(404, { errorCode: 'NOT_FOUND', message: 'Page not found' })
}
