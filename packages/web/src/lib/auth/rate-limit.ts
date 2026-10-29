import { getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'

// TODO: implement blocking
export const createRateLimiter = (options: { bucketSize: number; refillPerSecond: number }) => {
	const buckets = new Map<string, ReturnType<typeof createBucket>>()

	return ({ throwError }: { throwError?: () => {} }) => {
		const ip = getIp()

		let bucket = buckets.get(ip)
		if (!bucket) {
			bucket = createBucket(options)
			buckets.set(ip, bucket)
		}

		// Prune full buckets
		for (const [key, other] of buckets) {
			if (key === ip) continue
			other.fill()
			if (other.full) buckets.delete(key)
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
