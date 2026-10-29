import { form, getRequestEvent } from '$app/server'
import { error, invalid } from '@sveltejs/kit'
import { OTP_LENGTH, sendLoginOTPSchema, verifyLoginOTPSchema } from './admin-login'
import { create as createCache } from 'flat-cache'
import { dev } from '$app/env'
import { mailer } from '../mailer'
import { generateOtpEmailHtml } from './otp-email'
import { createRateLimiter } from './rate-limit'
import { ADMIN_MAIL_ADDRESS } from '$app/env/private'
import { timingSafeEqual } from 'node:crypto'
import { altcha } from './captcha'

const MAX_OTP_AGE_MS = 2 * 60 * 1000
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000
const MAX_OTP_ATTEMPTS = 3
const COOKIE_OPTS = {
	httpOnly: true,
	secure: true,
	path: '/',
	sameSite: 'strict',
	// domain: 'spanischer-verein.com',
} as const

const cache = createCache({
	cacheDir: '.cache',
	cacheId: 'admin-login',
	persistInterval: dev ? 10_000 : undefined,
})

type CurrentOtp = {
	otp: string
	attempts: number
	expiresAt: number
}

type CurrentSessionToken = {
	token: string
	expiresAt: number
}

export const sendLoginOTP = form(sendLoginOTPSchema, async (params, issue) => {
	await verifyAltcha()
	rateLimitSend({ throwError: () => invalid(issue('Too many requests')) })

	if (params.email !== ADMIN_MAIL_ADDRESS) {
		// We do not want to say that the email was incorrect.
		// We just don't send an email.
		return true
	}

	const otp = crypto
		.getRandomValues(new Uint8Array(OTP_LENGTH))
		.map(
			// This leads to 0-5 being slightly more probable than others, but it's negligible for this use case.
			(x) => x % 10,
		)
		.join('')

	// Intentionally not await to not block the request and to not give away that the email was correct.
	void mailer.send({
		html: generateOtpEmailHtml({ otp, expiresInMinutes: MAX_OTP_AGE_MS / 60_000 }),
		to: ADMIN_MAIL_ADDRESS,
		subject: `${otp} - Login Code für spanischer-verein.com`,
	})

	cache.set(
		'currentOtp',
		{ otp, attempts: 0, expiresAt: Date.now() + MAX_OTP_AGE_MS } satisfies CurrentOtp,
		MAX_OTP_AGE_MS,
	)

	return true
})

export const verifyLoginOTP = form(verifyLoginOTPSchema, async ({ otp }, issue) => {
	// We don't require a captcha here because the user would have to calculate a new one.
	// They have already done that in the step before this one, so we'll leave it at that.
	rateLimitVerify({ throwError: () => invalid(issue('Too many requests')) })

	const currentOtp = cache.get<CurrentOtp | undefined>('currentOtp')
	if (!currentOtp) invalid(issue.otp('OTP flow not started or expired'))

	const now = Date.now()
	if (now >= currentOtp.expiresAt) {
		cache.delete('currentOtp')
		invalid(issue.otp('OTP flow expired'))
	}

	if (!safeEqual(otp, currentOtp.otp)) {
		const attempts = currentOtp.attempts + 1
		if (attempts >= MAX_OTP_ATTEMPTS) cache.delete('currentOtp')
		else cache.set('currentOtp', { ...currentOtp, attempts } satisfies CurrentOtp, MAX_OTP_AGE_MS)

		invalid(issue.otp('OTP invalid'))
	}

	// Checks passed. Remove OTP
	cache.delete('currentOtp')

	// Create session
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

export const logout = form(async () => {
	const event = getRequestEvent()
	event.cookies.delete('SESSION_TOKEN', COOKIE_OPTS)
	event.cookies.delete('SESSION_TOKEN_PLACEHOLDER', {
		...COOKIE_OPTS,
		secure: false,
		httpOnly: false,
	})
})

const checkAuth = async () => {
	const { cookies } = getRequestEvent()
	const sessionToken = cookies.get('SESSION_TOKEN')
	if (!sessionToken) error(401, 'Unauthorized')

	const currentSessionToken = cache.get<CurrentSessionToken>('currentSessionToken')
	if (!currentSessionToken) error(401, 'Unauthorized')
	if (!safeEqual(currentSessionToken.token, sessionToken)) error(401, 'Unauthorized')

	const now = Date.now()
	if (now >= currentSessionToken.expiresAt) error(401, 'Unauthorized')
	// TODO: refresh

	return true
}

const rateLimitSend = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 / (2 * 60) })
const rateLimitVerify = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 / (10 * 60) })

const safeEqual = (a: string, b: string) => {
	const ba = Buffer.from(a)
	const bb = Buffer.from(b)
	return ba.length === bb.length && timingSafeEqual(ba, bb)
}

const verifyAltcha = async () => {
	const result = await altcha.verifyEvent(getRequestEvent())
	if (result.error) error(403, 'Failed to verify captcha')
}
