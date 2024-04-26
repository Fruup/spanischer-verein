import { sendNewsletterSubscriptionPreparation } from '$lib/mailer'
import { error, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email')?.toLowerCase()
	if (!email) throw error(400, { errorCode: 'INVALID_PARAMETERS', message: 'No email provided.' })

	const origin = url.searchParams.get('origin')?.toLowerCase()

	try {
		await sendNewsletterSubscriptionPreparation({ email, origin })
	} catch (e) {
		console.error(e)
		throw error(500, { errorCode: 'SEND_EMAIL_FAILED', message: 'Failed to send email.' })
	}

	return new Response()
}
