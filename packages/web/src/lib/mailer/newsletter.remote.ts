import { form } from '$app/server'
import { invalid } from '@sveltejs/kit'
import z from 'zod'
import { sendNewsletterRegistrationConfirmationLink } from './newsletter.server'

export const subscribeToNewsletter = form(
	z.object({
		email: z.email(),
		acceptPrivacy: z.boolean().optional(),
	}),
	async ({ email, acceptPrivacy }, issue) => {
		if (!acceptPrivacy) {
			invalid(issue.acceptPrivacy('Bitte akzeptiere die Datenschutzrichtlinien.'))
		}

		if (alreadySent.has(email)) return { alreadySubscribed: true }

		try {
			await sendNewsletterRegistrationConfirmationLink(email)
			alreadySent.add(email)
		} catch (e) {
			console.error(e)
			invalid(issue('Fehler beim Senden der Email.'))
		}

		return { alreadySubscribed: false }
	},
)

/** Addresses we already mailed a request for, so a double submit is a no-op. */
const alreadySent = new Set<string>()
