import { describe, expect, test } from 'vitest'
import { buildMonth } from './helpers'
import { DateTime } from 'luxon'

describe('Event calendar - helpers', () => {
	test('buildMonth - Jan 2024', () => {
		const now = DateTime.fromObject({ year: 2024, month: 1, day: 1 })
		const jan2024 = buildMonth(0, now)

		expect(Array.isArray(jan2024))
		expect(jan2024.length).toEqual(42)

		jan2024.forEach((date, index) => {
			expect(date.day).toEqual((index % 31) + 1)
			expect(date.weekday).toEqual((index % 7) + 1)
		})
	})

	test('buildMonth - Feb 2024', () => {
		const now = DateTime.fromObject({ year: 2024, month: 1, day: 1 })
		const feb2024 = buildMonth(1, now)

		expect(Array.isArray(feb2024))
		expect(feb2024.length).toEqual(42)

		feb2024.forEach((date, index) => {
			expect(date.weekday).toEqual((index % 7) + 1)
		})
	})

	test('buildMonth - random', () => {
		const randomize = () => DateTime.fromSeconds(Math.random() * 1e10)

		for (let i = 0; i < 100; i++) {
			const now = randomize()
			const month = buildMonth(0, now)

			expect(Array.isArray(month))
			expect(month.length).toEqual(42)

			month.forEach((date, index) => {
				expect(date.weekday).toEqual((index % 7) + 1)
			})
		}
	})
})
