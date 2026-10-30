import { query } from '$app/server'
import { error } from '@sveltejs/kit'
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

export const getPage = query(z.string(), async (pageUrl: string) => {
	const page = await sanityApi.getPage(pageUrl)
	if (!page) error(404, 'Page not found', { errorCode: 'NOT_FOUND' })

	return page
})

export const getEvent = query(z.string(), async (slug: string) => {
	const event = await sanityApi.getEvent(slug)
	if (!event) error(404, 'Event not found', { errorCode: 'NOT_FOUND' })

	return event
})
