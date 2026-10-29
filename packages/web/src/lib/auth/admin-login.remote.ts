import { form, getRequestEvent } from '$app/server'
import { invalid } from '@sveltejs/kit'
import { OTP_LENGTH, sendLoginOTPSchema, verifyLoginOTPSchema } from './admin-login'

import { mailer } from '../mailer'
import { generateOtpEmailHtml } from './otp-email'
import { createRateLimiter } from './rate-limit'
import { ADMIN_MAIL_ADDRESS } from '$app/env/private'
import { altcha } from './captcha'
import {
	adminLoginCache,
	checkAuth,
	createSession,
	removeSessionCookie,
	safeEqual,
} from './admin-login.server'
import type { StandardSchemaV1 } from '@sveltejs/kit/internal/types'

const MAX_OTP_AGE_MS = 2 * 60 * 1000
const MAX_OTP_ATTEMPTS = 3

type CurrentOtp = {
	otp: string
	attempts: number
	expiresAt: number
}

export const sendLoginOTP = form(sendLoginOTPSchema, async (params, issue) => {
	await verifyAltcha(issue)
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

	adminLoginCache.set(
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

	const currentOtp = adminLoginCache.get<CurrentOtp | undefined>('currentOtp')
	if (!currentOtp) invalid(issue.otp('OTP flow not started or expired'))

	const now = Date.now()
	if (now >= currentOtp.expiresAt) {
		adminLoginCache.delete('currentOtp')
		invalid(issue.otp('OTP flow expired'))
	}

	if (!safeEqual(otp, currentOtp.otp)) {
		const attempts = currentOtp.attempts + 1
		if (attempts >= MAX_OTP_ATTEMPTS) adminLoginCache.delete('currentOtp')
		else
			adminLoginCache.set(
				'currentOtp',
				{ ...currentOtp, attempts } satisfies CurrentOtp,
				MAX_OTP_AGE_MS,
			)

		invalid(issue.otp('OTP invalid'))
	}

	// Checks passed. Remove OTP
	adminLoginCache.delete('currentOtp')

	// Create session
	createSession()
})

export const logout = form(() => {
	if (checkAuth()) adminLoginCache.delete('currentSessionToken')
	removeSessionCookie()
})

const rateLimitSend = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 / (2 * 60) })
const rateLimitVerify = createRateLimiter({ bucketSize: 5, refillPerSecond: 1 / (10 * 60) })

const verifyAltcha = async (issue: (message: string) => StandardSchemaV1.Issue) => {
	const result = await altcha.verifyEvent(getRequestEvent())
	if (result.error) invalid(issue('Failed to verify captcha'))
}
