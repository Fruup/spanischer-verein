import { createClient } from '@sanity/client'
import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextBlock } from '@portabletext/types'

export const sanityClient = createClient({
	apiVersion: 'v2022-03-07',
	projectId: '6a1nd7zb',
	perspective: 'previewDrafts',
	apiHost: 'https://api.sanity.io',
	dataset: 'production',
	useCdn: false,
	token:
		'skIOafJ9K8zuoXIOJRKZlo5vB1xu0rE1htR80QIZHmfqL6d9iXxuUKNIxMyt3Hx8Br1y144bFcfdxXBkD5K8IZrzQc9KVeV1Qsg19JFR18UOVoU8KxCbNNvBPyea2zOUUhdNb8dPYAiiutgn0Zx3sCBxj0oSq3Nco8OzZ03q5nG3X6lT5Tki',
})

const imageUrlBuilder = createImageUrlBuilder(sanityClient)

export const sanityApi = {
	getEventsOverview: async () => {
		interface Result
			extends Pick<EventSchema, 'title' | 'eventTime' | 'eventLocation' | 'eventAdmission'> {
			slug: string
		}

		return await sanityClient.fetch<Result[]>(
			`*[
				_type == "event" &&
				(
					!defined(publishedAt) ||
					dateTime(now()) >= dateTime(publishedAt)
				)
			]{
				title,
				"slug": slug.current,
				eventTime,
				eventLocation,
				eventAdmission,
			}`,
		)
	},

	getUpcomingEventsOverview: async () => {
		interface Result
			extends Pick<EventSchema, 'title' | 'eventTime' | 'eventLocation' | 'eventAdmission'> {
			mainImage: SanityImageSource
			slug: string
			mainImageMeta: {
				prominentColor: string
				dimensions: {
					height: number
					width: number
				}
			}
		}

		const events = await sanityClient.fetch<Result[]>(
			`*[
				_type == "event" &&
				dateTime(now()) - $maxAge <= dateTime(eventTime) &&
				(
					!defined(publishedAt) ||
					dateTime(now()) >= dateTime(publishedAt)
				)
			]{
				title,
				"slug": slug.current,
				eventTime,
				eventLocation,
				eventAdmission,
				mainImage,
				"mainImageMeta": {
					"prominentColor": mainImage.asset->metadata.palette.dominant.background,
					"dimensions": mainImage.asset->metadata.dimensions,
				},
			}`,
			{
				maxAge: 31 * 24 * 60 * 60,
				// maxAge: 1 * 24 * 60 * 60, // one days in seconds
			},
		)

		const transformed = events.map((event) => ({
			...event,
			imageUrl: imageUrlBuilder.image(event.mainImage).maxWidth(512).maxHeight(512).url(),
		}))

		return transformed
	},

	getEvent: async (slug: string) => {
		return await sanityClient.fetch<EventSchema | undefined>(
			`*[_type == "event" && slug.current == "${slug}"][0]{
				...,
				"body": body[]{
					...,
					asset->,
				},
			}`,
		)
	},

	getNavigationTree: async () => {
		throw new Error('Not implemented')
	},

	getPage: async (slug: string) => {
		throw new Error('Not implemented')
	},
}
