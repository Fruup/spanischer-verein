import { command, form } from '$app/server'
import { error, invalid } from '@sveltejs/kit'
import { sendNewsletterSubscriptionRequest } from './index'

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Addresses we already mailed a request for, so a double submit is a no-op. */
const alreadySent = new Set<string>()

export const subscribeToNewsletter = form(
	'unchecked',
	async (data: { email?: string; acceptPrivacy?: string }, issue) => {
		const email = data.email?.trim().toLowerCase()

		if (!email || !emailRegexp.test(email)) {
			invalid(issue.email('Bitte gib eine gültige E-Mail-Adresse ein.'))
		}

		if (!data.acceptPrivacy) {
			invalid(issue.acceptPrivacy('Bitte akzeptiere die Datenschutzrichtlinien.'))
		}

		if (alreadySent.has(email)) return { alreadySubscribed: true }

		try {
			await sendNewsletterSubscriptionRequest(email)
			alreadySent.add(email)
		} catch (e) {
			console.error(e)
			error(500, 'Failed to send email.', { errorCode: 'SEND_EMAIL_FAILED' })
		}

		return { alreadySubscribed: false }
	},
)

/**
 * Used by the `/newsletter/register?email=...` landing page, which is where the
 * links in the newsletter point. v1 fetched `/api/v1/newsletter/request` here,
 * an endpoint that never existed, so the page always failed.
 */
export const confirmNewsletterSubscription = command('unchecked', async (email: string) => {
	const normalized = email.trim().toLowerCase()

	if (!emailRegexp.test(normalized)) {
		error(400, 'No valid email provided.', { errorCode: 'INVALID_PARAMETERS' })
	}

	if (alreadySent.has(normalized)) return

	try {
		await sendNewsletterSubscriptionRequest(normalized)
		alreadySent.add(normalized)
	} catch (e) {
		console.error(e)
		error(500, 'Failed to send email.', { errorCode: 'SEND_EMAIL_FAILED' })
	}
})
