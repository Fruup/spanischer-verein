import { describe, expect, it } from 'vitest'

import { pick } from './pick.js'

describe('pick', () => {
	it('returns null for an empty array', () => {
		expect(pick([])).toBeNull()
	})

	it('returns null when every index is excluded', () => {
		expect(pick(['a', 'b'], [0, 1])).toBeNull()
	})

	it('picks the only item available', () => {
		expect(pick(['a'])).toEqual({ value: 'a', index: 0 })
	})

	it('always picks an eligible index, never an excluded one', () => {
		// Exhaustive rather than probabilistic: the v1 implementation failed this.
		for (let run = 0; run < 200; run++) {
			expect(pick(['a', 'b'], [0])).toEqual({ value: 'b', index: 1 })
		}
	})

	it('stays within bounds across many draws', () => {
		const items = ['a', 'b', 'c', 'd']

		for (let run = 0; run < 200; run++) {
			const result = pick(items, [1])

			expect(result).not.toBeNull()
			expect([0, 2, 3]).toContain(result!.index)
			expect(result!.value).toBe(items[result!.index])
		}
	})
})
