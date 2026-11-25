import type { RequestHandler } from './$types'

/** Liveness probe for the container healthcheck. Deliberately touches nothing
 * external (Sanity, mail), so an upstream outage doesn't restart the app. */
export const GET: RequestHandler = () =>
	new Response('ok', { headers: { 'cache-control': 'no-store' } })
