import { redirect } from '@sveltejs/kit'
import { sequence, type Handle } from '@sveltejs/kit/hooks'
import { resolveLocale } from '#lib/locale/index.server.ts'
import { touchSession } from '#lib/auth/admin-login.server.ts'

const archiveHandler: Handle = async ({ event, resolve }) => {
	// The month archive at `/archiv/<year>-<month>` was replaced by the paginated
	// overview on `/`. Those URLs are indexed, so send them on rather than 404.
	const { pathname } = event.url
	if (pathname === '/archiv' || pathname.startsWith('/archiv/')) {
		redirect(301, '/')
	}

	return resolve(event)
}

const localeHandler: Handle = async ({ event, resolve }) => {
	event.locals.locale = resolveLocale(event)

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', event.locals.locale),
	})
}

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.session = await touchSession()
	return resolve(event)
}

export const handle: Handle = sequence(archiveHandler, localeHandler, authHandler)
