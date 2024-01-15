import { createClient } from '@sanity/client'
import type { EventInfoSchema } from '@spanischer-verein/sanity/schemas/eventInfo'
import type { PostSchema } from '@spanischer-verein/sanity/schemas/post'

export const sanityClient = createClient({
	apiVersion: 'v2022-03-07',
	projectId: '6a1nd7zb',
	perspective: 'raw',
	apiHost: 'https://api.sanity.io',
	dataset: 'production',
	useCdn: true,
	token:
		'skIOafJ9K8zuoXIOJRKZlo5vB1xu0rE1htR80QIZHmfqL6d9iXxuUKNIxMyt3Hx8Br1y144bFcfdxXBkD5K8IZrzQc9KVeV1Qsg19JFR18UOVoU8KxCbNNvBPyea2zOUUhdNb8dPYAiiutgn0Zx3sCBxj0oSq3Nco8OzZ03q5nG3X6lT5Tki',
})

export const sanityApi = {
	getEventsOverview: async () => {
		const posts = await sanityClient.fetch<
			{ slug: string; title: string; events: EventInfoSchema[] }[]
		>(
			`*[_type == "post"]{
				title,
				"slug": slug.current,
				"events": body[_type == "eventInfo"] + [eventInfo][@ != null],
			}`,
		)

		interface EventsOverviewItem {
			title: string
			slug: string
			eventTime: string
		}

		return posts
			.flatMap((post) =>
				post.events.map((event) => ({
					title: post.title,
					slug: post.slug,
					eventTime: event.eventTime,
				})),
			)
			.filter((event): event is EventsOverviewItem => !!event.eventTime)
	},

	getPost: async (slug: string) => {
		return await sanityClient.fetch<PostSchema | undefined>(
			`*[_type == "post" && slug.current == "${slug}"][0]{
				...,
				"body": body[]{
					...,
					asset->,
					location->,
				},
			}`,
		)
	},
}
