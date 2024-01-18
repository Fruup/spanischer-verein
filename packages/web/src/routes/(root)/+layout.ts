import { sanityApi } from '$lib/sanity/client'

export const load = async () => {
	const eventsPromise = sanityApi.getEventsOverview()
	const postsPromise = sanityApi.getPostsOverview()

	return {
		events: await eventsPromise,
		posts: await postsPromise,
	}
}
