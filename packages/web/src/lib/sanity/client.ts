import { createClient } from '@sanity/client'
import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextBlock, PortableTextMarkDefinition } from '@portabletext/types'
import { env } from '$env/dynamic/private'
import type { PageSchema } from '@spanischer-verein/sanity/schemas/page'

export const sanityClient = createClient({
	apiVersion: 'v2022-03-07',
	projectId: '6a1nd7zb',
	perspective: 'previewDrafts',
	apiHost: 'https://api.sanity.io',
	dataset: 'production',
	useCdn: false,
	token: env.SANITY_TOKEN,
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
		const page = await sanityClient.fetch<PageSchema | undefined>(`
			*[_type == "page" && slug.current == "${slug}"][0]{
				...,
				"body": body[]{
					...,
					asset->,
				},
			}
		`)

		if (!page) return

		const promises = page.body.flatMap((block) =>
			(block.markDefs as PortableTextMarkDefinition[])?.map(async (markDef) => {
				// Resolve internal links.
				if (markDef._type === 'internalLink') {
					markDef.resolvedReference = await sanityClient.fetch<{
						_type: string
						slug: string
					}>(`
						*[_id == "${markDef._ref}"][0]{
							_type,
							"slug": slug.current,
						}
					`)
				}
			}),
		)

		await Promise.all(promises)

		return page
	},
}
