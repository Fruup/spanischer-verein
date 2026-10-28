import { form, getRequestEvent, query } from '$app/server'
import { error, invalid } from '@sveltejs/kit'
import { OTP_LENGTH, sendLoginOTPSchema, verifyLoginOTPSchema } from './admin-login'
import { create as createCache } from 'flat-cache'
import { dev } from '$app/env'
import { mailer } from '../mailer'
import { generateOtpEmailHtml } from './otp-email'
import { createRateLimiter } from './rate-limit'
import { ADMIN_MAIL_ADDRESS } from '$app/env/private'

const MAX_OTP_AGE_MS = 2 * 60 * 1000
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000
const COOKIE_OPTS = {
	httpOnly: true,
	secure: true,
	path: '/',
	sameSite: 'lax',
	// domain: 'spanischer-verein.com',
} as const

const cache = createCache({
	cacheDir: '.cache',
	cacheId: 'admin-login',
	persistInterval: dev ? 10_000 : undefined,
})

type CurrentOtp = {
	otp: string
}

type CurrentSessionToken = {
	token: string
	expiresAt: number
}

export const sendLoginOTP = form(sendLoginOTPSchema, async (params, issue) => {
	rateLimit({ throwError: () => invalid(issue('Too many requests')) })

	if (params.email !== ADMIN_MAIL_ADDRESS) invalid(issue.email('Unbekannte E-Mail'))

	const otp = crypto
		.getRandomValues(new Uint8Array(OTP_LENGTH))
		.map(
			// This leads to 0-5 being slightly more probable than others, but it's negligible for this use case.
			(x) => x % 10,
		)
		.join('')
		.padStart(OTP_LENGTH, '0')

	await mailer.send({
		html: generateOtpEmailHtml({ otp, expiresInMinutes: MAX_OTP_AGE_MS / 60_000 }),
		to: ADMIN_MAIL_ADDRESS,
		subject: `${otp} - Login Code für spanischer-verein.com`,
	})

	cache.set('currentOtp', { otp } satisfies CurrentOtp, MAX_OTP_AGE_MS)

	return true
})

export const verifyLoginOTP = form(verifyLoginOTPSchema, async ({ otp }, issue) => {
	rateLimit({ throwError: () => invalid(issue('Too many requests')) })

	const currentOtp = cache.get<CurrentOtp>('currentOtp')
	if (!currentOtp) invalid(issue.otp('OTP flow not started or expired'))
	if (otp !== currentOtp.otp) invalid(issue.otp('OTP invalid')) // timing-safe equals is unnecessary here - length is known

	// Checks passed
	const sessionToken = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')
	const expiresAt = Date.now() + MAX_SESSION_AGE_MS

	cache.set(
		'currentSessionToken',
		{
			token: sessionToken,
			expiresAt,
		} satisfies CurrentSessionToken,
		MAX_SESSION_AGE_MS,
	)

	const event = getRequestEvent()
	event.cookies.set('SESSION_TOKEN', sessionToken, {
		expires: new Date(expiresAt),
		...COOKIE_OPTS,
	})
	event.cookies.set('SESSION_TOKEN_PLACEHOLDER', '', {
		expires: new Date(expiresAt),
		...COOKIE_OPTS,
		secure: false,
		httpOnly: false,
	})
})

export const checkAuth = query(async () => {
	const { cookies } = getRequestEvent()
	const sessionToken = cookies.get('SESSION_TOKEN')
	if (!sessionToken) error(401, 'Unauthorized')

	const currentSessionToken = cache.get<CurrentSessionToken>('currentSessionToken')
	if (!currentSessionToken) error(401, 'Unauthorized')
	if (currentSessionToken.token !== sessionToken) error(401, 'Unauthorized')

	const now = Date.now()
	if (now >= currentSessionToken.expiresAt) error(401, 'Unauthorized')
	// TODO: refresh

	return true
})

const rateLimit = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 })
