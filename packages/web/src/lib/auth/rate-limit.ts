import { getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'
import { CappedMap } from 'altcha-lib/frameworks/sveltekit'

const PRUNE_INTERVAL_MS = 60_000

// TODO: implement blocking
export const createRateLimiter = (options: {
	bucketSize: number
	refillPerSecond: number
	/** @default 'ip' */
	groupBy?: 'global' | 'ip'
}) => {
	const { groupBy = 'ip' } = options

	// Caps memory only. Eviction is FIFO on insertion order, not LRU, and an evicted
	// group gets a fresh full bucket, so this is not a limit in itself.
	const buckets = new CappedMap<string, ReturnType<typeof createBucket>>({ maxSize: 10_000 })
	let lastPrune = 0

	return ({ throwError }: { throwError?: () => never }) => {
		const group = groupBy === 'global' ? 'global' : getIp()

		let bucket = buckets.get(group)
		if (!bucket) {
			bucket = createBucket(options)
			buckets.set(group, bucket)
		}

		// Prune full buckets. A full bucket carries no state worth keeping, so this is
		// pure garbage collection. Throttled because it scans every bucket.
		const now = Date.now()
		if (now - lastPrune >= PRUNE_INTERVAL_MS) {
			lastPrune = now
			for (const [key, other] of buckets) {
				if (key === group) continue
				other.fill()
				if (other.full) buckets.delete(key)
			}
		}

		if (!bucket.run()) {
			if (throwError) {
				throwError()
			} else {
				error(429, 'Too many requests', {
					errorCode: 'TOO_MANY_REQUESTS',
				})
			}
		}
	}
}

const createBucket = (options: { bucketSize: number; refillPerSecond: number }) => {
	let count = options.bucketSize
	let lastTimestamp: number = 0

	const update = (delta: number) => {
		count = Math.min(Math.max(count + delta, 0), options.bucketSize)
	}

	const fill = () => {
		const now = Date.now()

		if (!lastTimestamp || now < lastTimestamp) {
			lastTimestamp = now
			return
		}

		const fullSeconds = Math.floor((now - lastTimestamp) / 1000)

		update(fullSeconds * options.refillPerSecond)
		lastTimestamp += fullSeconds * 1000
	}

	return {
		fill,
		run: () => {
			fill()
			if (count < 1) return false
			update(-1)
			return true
		},
		get full() {
			return count >= options.bucketSize
		},
	}
}

const getIp = () => getRequestEvent().getClientAddress()
