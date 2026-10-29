import { timingSafeEqual } from 'node:crypto'
import { create as createCache } from 'flat-cache'
import { dev } from '$app/env'
import { getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'

const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000
const SESSION_REFRESH_MIN_AGE_MS = 1 * 24 * 60 * 60 * 1000
// Do not allow refreshing sessions past this point
const REQUIRE_LOGIN_AFTER_MS = 90 * 24 * 60 * 60 * 1000
const COOKIE_OPTS = {
	httpOnly: true,
	secure: true,
	path: '/',
	sameSite: 'strict',
	// domain: 'spanischer-verein.com',
} as const

export const createSession = () => {
	const now = Date.now()
	const sessionToken = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')
	const expiresAt = now + MAX_SESSION_AGE_MS

	adminLoginCache.set(
		'currentSessionToken',
		{
			token: sessionToken,
			expiresAt,
			createdAt: now,
		} satisfies CurrentSessionToken,
		MAX_SESSION_AGE_MS,
	)

	setSessionCookie(sessionToken, expiresAt)
}

const setSessionCookie = (sessionToken: string, expiresAt: number) => {
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
}

export const removeSessionCookie = () => {
	const event = getRequestEvent()
	event.cookies.delete('SESSION_TOKEN', COOKIE_OPTS)
	event.cookies.delete('SESSION_TOKEN_PLACEHOLDER', {
		...COOKIE_OPTS,
		secure: false,
		httpOnly: false,
	})
}

/**
 * Checks and refreshes the admin session
 * @returns whether the admin session is valid
 */
export const touchSession = (): boolean => {
	const { cookies } = getRequestEvent()
	const sessionToken = cookies.get('SESSION_TOKEN')
	if (!sessionToken) return false

	const currentSessionToken = adminLoginCache.get<CurrentSessionToken>('currentSessionToken')
	if (!currentSessionToken) return false
	if (!safeEqual(currentSessionToken.token, sessionToken)) return false

	const now = Date.now()
	if (now >= currentSessionToken.expiresAt) return false
	if (now >= currentSessionToken.createdAt + REQUIRE_LOGIN_AFTER_MS) {
		adminLoginCache.delete('currentSessionToken')
		return false
	}

	if (now >= currentSessionToken.expiresAt - MAX_SESSION_AGE_MS + SESSION_REFRESH_MIN_AGE_MS) {
		// Refresh session lifetime.
		// We do not rotate the token to avoid a race condition with multiple in-flight requests.
		const expiresAt = now + MAX_SESSION_AGE_MS

		adminLoginCache.set(
			'currentSessionToken',
			{ ...currentSessionToken, expiresAt } satisfies CurrentSessionToken,
			MAX_SESSION_AGE_MS,
		)

		setSessionCookie(sessionToken, expiresAt)
	}

	return true
}

export const checkAuth = () => getRequestEvent().locals.isAdmin
export const requireAuth = () => {
	if (!checkAuth) error(401, 'Unauthorized')
}

export const adminLoginCache = createCache({
	cacheDir: '.cache',
	cacheId: 'admin-login',
	persistInterval: dev ? 10_000 : undefined,
})

export type CurrentSessionToken = {
	token: string
	expiresAt: number
	createdAt: number
}

export const safeEqual = (a: string, b: string) => {
	const ba = Buffer.from(a)
	const bb = Buffer.from(b)
	return ba.length === bb.length && timingSafeEqual(ba, bb)
}
