import { create as createCache } from 'flat-cache'
import { createClient } from '@sanity/client'
import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextMarkDefinition } from '@portabletext/types'
import type { PageSchema } from '@spanischer-verein/sanity/schemas/page'
import type { SiteSettingsSchema } from '@spanischer-verein/sanity/schemas/siteSettings'
import type { NavigationItem } from '$lib/components/header/types'
import { env } from '$env/dynamic/private'
import { CalendarDateTime } from '@internationalized/date'

export const sanityClient = createClient({
	apiVersion: 'v2022-03-07',
	projectId: '6a1nd7zb',
	perspective:
		(env.SANITY_PERSPECTIVE as any) || (import.meta.env.PROD ? 'published' : 'previewDrafts'),
	apiHost: 'https://api.sanity.io',
	dataset: env.SANITY_DATASET || (import.meta.env.PROD ? 'production' : 'development'),
	useCdn: import.meta.env.PROD,
	token: env.SANITY_TOKEN,
})

const imageUrlBuilder = createImageUrlBuilder(sanityClient)

const cache = env.ENABLE_CACHE?.toLowerCase() === 'true' ? createCache() : null

export const sanityApi = {
	async getEventsOverview(options: { year: number; month: number }) {
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

		// Check for cached value
		const cacheKey = `sanity:getEventsOverview:${options.year}-${options.month}`
		const cached = cache?.get<typeof transformed>(cacheKey)
		if (cached) return cached

		const from = new CalendarDateTime(options.year, options.month, 1)
		const to = from.copy().add({ months: 1 })

		const timeZone = 'Europe/Berlin'

		const events = await sanityClient.fetch<Result[]>(
			`*[
				_type == "event" &&
				(
					!defined(publishedAt) ||
					dateTime(now()) >= dateTime(publishedAt)
				) &&
				dateTime(eventTime) >= dateTime($from) &&
				dateTime(eventTime) < dateTime($to)
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
			} | order(eventTime asc)`,
			{
				from: `${from.toDate(timeZone).toISOString()}`,
				to: `${to.toDate(timeZone).toISOString()}`,
			},
		)

		const transformed = events.map((event) => ({
			...event,
			imageUrl:
				event.mainImage &&
				imageUrlBuilder.image(event.mainImage).width(512).crop('focalpoint').format('webp').url(),
		}))

		// Cache the result
		cache?.setKey(cacheKey, transformed, 10 * 60 * 1000) // 10 minutes

		return transformed
	},

	async getPastHighlights() {
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

		// Check for cached value
		const cacheKey = `sanity:getPastHighlights`
		const cached = cache?.get<typeof transformed>(cacheKey)
		if (cached) return cached

		const events = await sanityClient.fetch<Result[]>(
			`*[
				_type == "event" &&
				highlighted == true &&
				dateTime(eventTime) < dateTime(now())
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
			} | order(eventTime desc)`,
		)

		const transformed = events.map((event) => ({
			...event,
			imageUrl:
				event.mainImage &&
				imageUrlBuilder.image(event.mainImage).width(512).crop('focalpoint').format('webp').url(),
		}))

		// Cache the result
		cache?.setKey(cacheKey, transformed, 15 * 60 * 1000) // 15 minutes

		return transformed
	},

	async getEvent(slug: string) {
		// Check for cached value
		const cacheKey = `sanity:getEvent:${slug}`
		const cached = cache?.get<typeof transformed>(cacheKey)
		if (cached) return cached

		const result = await sanityClient.fetch<EventSchema | undefined>(
			`*[_type == "event" && slug.current == "${slug}"][0]{
				...,
				"body": body[]{
					...,
					asset->,
				},
			}`,
		)

		if (!result) return

		const body = result.body.map((block) => ({
			...block,
			transformedImageUrl:
				block._type === 'image' &&
				imageUrlBuilder
					.image((block as any).asset)
					.width(500)
					.format('webp')
					.url(),
		}))

		const transformed = {
			...result,
			body,
		}

		// Cache the result
		cache?.setKey(cacheKey, transformed, 10 * 60 * 1000) // 10 minutes

		return transformed
	},

	async getNavigationTree() {
		interface FlatTreeItem {
			_key: string
			parent: string | null
			value: {
				_type: string
				title: string
				slug: string
			}
		}

		// Check for cached value
		const cacheKey = `sanity:getNavigationTree`
		const cached = cache?.get<typeof tree>(cacheKey)
		if (cached) return cached

		const result = await sanityClient.fetch<{
			tree: FlatTreeItem[]
		}>(`
			*[_id == "page-structure"][0]{
				tree[] {
					_key,
					parent,
			
					"value": value.reference->{
						_type,
						"slug": slug.current,
						title,
					},
				}
			}
		`)

		if (!result) return []

		const { tree: flatTree } = result

		type TreeItem = NavigationItem & { _key: string }

		function buildSubTree(flatTree: FlatTreeItem[], parent: TreeItem | null): TreeItem[] {
			const children: FlatTreeItem[] = []
			const rest: FlatTreeItem[] = []

			flatTree.forEach((node) => {
				if (node.parent == parent?._key) children.push(node)
				else rest.push(node)
			})

			return children.map((child) => {
				const childAsParent: TreeItem = {
					// ...child,
					_key: child._key,
					title: child.value.title,
					href: parent ? `${parent.href}/${child.value.slug}` : `/${child.value.slug}`,
					children: [], // set below
				}

				childAsParent.children = buildSubTree(rest, childAsParent)

				return childAsParent
			})
		}

		const tree = buildSubTree(flatTree, null)

		// Cache the result
		cache?.setKey(cacheKey, tree, 20 * 60 * 1000) // 20 minutes

		return tree
	},

	async getPage(pathname: string) {
		// Check for cached value
		const cacheKey = `sanity:getPage:${pathname}`
		const cached = cache?.get<typeof page>(cacheKey)
		if (cached) return cached

		const slug = pathname.split('/').at(-1)

		const page = await sanityClient.fetch<PageSchema | undefined>(`
			*[_type == "page" && slug.current == "${slug}"][0]{
				...,
				"body": body[]{
					...,
					asset->,
				},
			}
		`)

		if (!page?.body) return

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

		page.body = page.body.map((block) => ({
			...block,
			transformedImageUrl:
				block._type === 'image' &&
				imageUrlBuilder
					.image((block as any).asset)
					.width(500)
					.format('webp')
					.url(),
		}))

		// Cache the result
		cache?.setKey(cacheKey, page, 10 * 60 * 1000) // 10 minutes

		return page
	},

	async getSiteSettings() {
		// Check for cached value
		const cacheKey = `sanity:getSiteSettings`
		const cached = cache?.get<typeof transformed>(cacheKey)
		if (cached) return cached

		const settings = await sanityClient.fetch<
			| (Pick<SiteSettingsSchema, 'donationLink' | 'contactEmail'> & {
					logo: SanityImageSource
					headerImages?: SanityImageSource[]
					imprintPageSlug?: string
					privacyPageSlug?: string
			  })
			| null
		>(`
			*[_id == "siteSettings"][0]{
				logo,
				headerImages,
				donationLink,
				"imprintPageSlug": imprintPage->slug.current,
				"privacyPageSlug": privacyPage->slug.current,
				contactEmail,
			}
		`)

		if (!settings) return null

		const transformed = {
			donationLink: settings.donationLink,
			imprintPageSlug: settings.imprintPageSlug,
			privacyPageSlug: settings.privacyPageSlug,
			contactEmail: settings.contactEmail,
			headerImageUrls: settings.headerImages?.map((image) =>
				imageUrlBuilder.image(image).height(512).format('webp').url(),
			),
			logoUrl: imageUrlBuilder.image(settings.logo).height(400).format('webp').url(),
		}

		// Cache the result
		cache?.setKey(cacheKey, transformed, 10 * 60 * 1000) // 10 minutes

		return transformed
	},

	async getNewsletterSubscriptionRecipient() {
		const settings = await sanityClient.fetch<Pick<
			SiteSettingsSchema,
			'newsletterSubscriptionRecipient'
		> | null>(`
			*[_id == "siteSettings"][0]{
				newsletterSubscriptionRecipient,
			}
		`)

		return settings?.newsletterSubscriptionRecipient
	},
}
