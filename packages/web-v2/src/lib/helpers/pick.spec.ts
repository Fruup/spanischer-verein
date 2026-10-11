import { describe, expect, it } from 'vitest'

import { pick } from './pick.js'

describe('pick', () => {
	it('returns null for an empty array', () => {
		expect(pick([])).toBeNull()
	})

	it('picks the only item available', () => {
		expect(pick(['a'])).toEqual({ value: 'a', index: 0 })
	})

	it('never picks an excluded index', () => {
		const result = pick(['a', 'b'], [0])

		expect(result).not.toBeNull()
		expect(result?.index).toBe(1)
	})
})
