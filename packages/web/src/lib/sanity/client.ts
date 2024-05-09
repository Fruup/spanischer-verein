import { createClient } from '@sanity/client'
import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { PortableTextMarkDefinition } from '@portabletext/types'
import type { PageSchema } from '@spanischer-verein/sanity/schemas/page'
import type { SiteSettingsSchema } from '@spanischer-verein/sanity/schemas/siteSettings'
import type { NavigationItem } from '$lib/components/header/types'
import { env } from '$env/dynamic/private'

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
				from: `${options.year}-${options.month.toString().padStart(2, '0')}-01T00:00:00Z`,
				to: `${options.year}-${(options.month + 1).toString().padStart(2, '0')}-01T00:00:00Z`,
			},
		)

		const transformed = events.map((event) => ({
			...event,
			imageUrl:
				event.mainImage &&
				imageUrlBuilder.image(event.mainImage).width(512).crop('focalpoint').format('webp').url(),
		}))

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

		return transformed
	},

	async getEvent(slug: string) {
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

		return {
			...result,
			body,
		}
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
		return tree
	},

	async getPage(pathname: string) {
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

		return page
	},

	async getSiteSettings() {
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

		return {
			donationLink: settings.donationLink,
			imprintPageSlug: settings.imprintPageSlug,
			privacyPageSlug: settings.privacyPageSlug,
			contactEmail: settings.contactEmail,
			headerImageUrls: settings.headerImages?.map((image) =>
				imageUrlBuilder.image(image).height(512).format('webp').url(),
			),
			logoUrl: imageUrlBuilder.image(settings.logo).width(200).format('webp').url(),
		}
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
