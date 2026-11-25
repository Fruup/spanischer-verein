import { describe, expect, it } from 'vitest'

import { duration } from './motion.js'

describe('duration', () => {
	it('is ordered from fast to ambient', () => {
		expect(duration.fast).toBeLessThan(duration.base)
		expect(duration.base).toBeLessThan(duration.slow)
		expect(duration.slow).toBeLessThan(duration.ambient)
	})
})
