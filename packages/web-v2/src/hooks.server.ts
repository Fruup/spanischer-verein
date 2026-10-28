import { redirect } from '@sveltejs/kit'
import { sequence, type Handle } from '@sveltejs/kit/hooks'

const archiveHandler: Handle = async ({ event, resolve }) => {
	// The month archive at `/archiv/<year>-<month>` was replaced by the paginated
	// overview on `/`. Those URLs are indexed, so send them on rather than 404.
	const { pathname } = event.url
	if (pathname === '/archiv' || pathname.startsWith('/archiv/')) {
		redirect(301, '/')
	}

	return resolve(event)
}

export const handle: Handle = sequence(archiveHandler)
