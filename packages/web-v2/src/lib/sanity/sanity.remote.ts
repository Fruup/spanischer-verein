import { prerender, query } from '$app/server'
import { error } from '@sveltejs/kit'
import { NEWSLETTER_SLUG } from '$app/env/private'
import { pick } from '#lib/helpers/pick.js'
import { sanityApi } from './client'
import { z } from 'zod'

export const getSiteSettings = query(() => sanityApi.getSiteSettings())

export const getNavigationTree = query(() => sanityApi.getNavigationTree())

export const getPastHighlights = query(() => sanityApi.getPastHighlights())

export const getEventsOverview = query(z.object({ year: z.number(), month: z.number() }), (month) =>
	sanityApi.getEventsOverview(month),
)

export const getCurrentEventsOverview = query(z.number().int().min(0).max(100), (pageIndex) =>
	sanityApi.getCurrentEventsOverview(pageIndex),
)

/**
 * Two distinct indices into `siteSettings.headerImageUrls`, picked at random.
 * Lives on the server so both halves of the header agree during SSR.
 */
export const getHeaderImageIndices = query(async () => {
	const siteSettings = await getSiteSettings()
	const headerImages = siteSettings?.headerImageUrls ?? []

	const left = pick(headerImages)?.index ?? 0
	const right = pick(headerImages, [left])?.index ?? 0

	return { left, right }
})

export const getPage = query('unchecked', async (pageUrl: string) => {
	const page = await sanityApi.getPage(pageUrl)
	if (!page) error(404, 'Page not found', { errorCode: 'NOT_FOUND' })

	return page
})

export const getEvent = query('unchecked', async (slug: string) => {
	const event = await sanityApi.getEvent(slug)
	if (!event) error(404, 'Event not found', { errorCode: 'NOT_FOUND' })

	return event
})

/**
 * The newsletter build (`bun run build-newsletter`) prerenders a single event
 * page to static HTML, so that route reads its data through `prerender` rather
 * than `query`. `dynamic: true` keeps the same function usable at runtime for
 * the regular, server-rendered build.
 */
export const getNewsletterEvent = prerender(
	'unchecked',
	async (slug: string) => {
		const event = await sanityApi.getEvent(slug)
		if (!event) error(404, 'Event not found', { errorCode: 'NOT_FOUND' })

		return event
	},
	{
		inputs: () => (NEWSLETTER_SLUG ? [NEWSLETTER_SLUG] : []),
		dynamic: true,
	},
)
