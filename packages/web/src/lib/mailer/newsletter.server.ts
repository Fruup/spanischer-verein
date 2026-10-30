import { dev } from '$app/env'
import { create as createCache } from 'flat-cache'
import {
	generateNewsletterRegistrationConfirmationHtml,
	generateNewsletterRegistrationRequestHtml,
} from './newsletter-templates'
import { mailer } from '.'
import z from 'zod'
import { createRateLimiter } from '#lib/auth/rate-limit.ts'

const MAX_TOKEN_AGE_MS = 1 * 60 * 60 * 1000

interface StoredToken {
	mail: string
}

export const sendNewsletterRegistrationConfirmationLink = async (mail: string) => {
	rateLimit({})

	const token = crypto.randomUUID()
	cache.set(`token:${token}`, { mail } satisfies StoredToken, MAX_TOKEN_AGE_MS)

	await mailer.send({
		html: generateNewsletterRegistrationConfirmationHtml(token),
		to: mail,
		subject: 'Newsletter-Anmeldung Spanischer Verein',
	})
}

export const handleNewsletterRegistrationConfirmation = async (token: string) => {
	rateLimit({})

	if (!z.uuid().safeParse(token).success) return false

	const key = `token:${token}`

	const cached = cache.get<StoredToken | undefined>(key)
	if (!cached) return false

	cache.delete(key)

	// Send email to admin
	await mailer.send({
		html: generateNewsletterRegistrationRequestHtml(cached.mail),
		to: 'mail@leon.sh', // TODO:
		subject: 'Neue Newsletter-Anmeldung',
	})

	return true
}

const cache = createCache({
	cacheDir: '.cache',
	cacheId: 'newsletter-subscription',
	persistInterval: dev ? 10_000 : undefined,
})

const rateLimit = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 / (2 * 60) })
