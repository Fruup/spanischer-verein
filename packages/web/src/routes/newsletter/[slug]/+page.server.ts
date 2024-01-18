import { sanityApi } from '$lib/sanity/client'
import { error } from '@sveltejs/kit'

export const prerender = true

export const load = async ({ params }) => {
	const post = await sanityApi.getPost(params.slug)

	if (!post) throw error(404, 'Post not found')

	return {
		post,
	}
}
