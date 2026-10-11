import { describe, expect, it } from 'vitest'

import { getEventUrl, parseMonthFromUrl } from './url.js'

describe('getEventUrl', () => {
	it('builds the event route', () => {
		expect(getEventUrl('fiesta')).toBe('/event/fiesta')
	})
})

describe('parseMonthFromUrl', () => {
	it('parses year and month route params', () => {
		expect(parseMonthFromUrl({ year: '2024', month: '03' })).toEqual({ year: 2024, month: 3 })
	})

	it('falls back to the current month when params are missing', () => {
		const now = new Date()

		expect(parseMonthFromUrl({})).toEqual({
			year: now.getFullYear(),
			month: now.getMonth() + 1,
		})
	})
})
