import { error } from '@sveltejs/kit'

export const createRateLimiter = (options: { bucketSize: number; refillPerSecond: number }) => {
	let bucket = options.bucketSize
	let lastTimestamp: number = 0

	const update = (delta: number) => {
		bucket = Math.min(Math.max(bucket + delta, 0), options.bucketSize)
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

	const run = () => {
		fill()
		if (bucket <= 0) return false
		update(-1)
		return true
	}

	return ({ throwError }: { throwError?: () => {} }) => {
		if (!run()) {
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
