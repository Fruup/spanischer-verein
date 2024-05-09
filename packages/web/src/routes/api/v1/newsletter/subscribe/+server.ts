import { sendNewsletterSubscriptionRequest } from '$lib/mailer'
import { error, type RequestHandler } from '@sveltejs/kit'

const cache: Record<string, boolean> = {}

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email')?.toLowerCase()
	if (!email) throw error(400, { errorCode: 'INVALID_PARAMETERS', message: 'No email provided.' })

	// Check cache.
	if (cache[email]) return new Response('cached', { status: 200 })

	try {
		await sendNewsletterSubscriptionRequest(email)

		// Set cache.
		cache[email] = true
	} catch (e) {
		console.error(e)
		throw error(500, { errorCode: 'SEND_EMAIL_FAILED', message: 'Failed to send email.' })
	}

	return new Response()
}
