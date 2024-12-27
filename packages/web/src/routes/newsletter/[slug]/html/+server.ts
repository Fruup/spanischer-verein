import { render } from 'svelte/server'
import Newsletter from '$lib/components/Newsletter.svelte'
import type { RequestHandler } from './$types'
import { sanityApi } from '$lib/sanity/client'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const newsletter = await sanityApi.getNewsletter(params.slug)
	if (!newsletter) throw error(404, { errorCode: 'NOT_FOUND', message: 'Newsletter not found' })

	const { body, head } = render(Newsletter, {
		props: {
			title: newsletter.title,
			content: newsletter.content,
			events: newsletter.featuredEvents,
		},
	})

	console.log({ body, head })

	return new Response(`${head}${body}`, {
		headers: {
			'Content-Type': 'text/html',
		},
	})
}
