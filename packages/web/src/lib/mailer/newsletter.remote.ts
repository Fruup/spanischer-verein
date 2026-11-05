import { form, getRequestEvent } from '$app/server'
import { invalid } from '@sveltejs/kit'
import { sendNewsletterRegistrationConfirmationLink } from './newsletter.server'
import { newsletterSchema } from './newsletter'
import { t } from '#lib/messages/index.ts'

export const subscribeToNewsletter = form(
	newsletterSchema(() => getRequestEvent().locals.locale),
	async ({ email }, issue) => {
		const locale = getRequestEvent().locals.locale

		if (alreadySent.has(email)) return { alreadySubscribed: true }

		try {
			await sendNewsletterRegistrationConfirmationLink(email, locale)
			alreadySent.add(email)
		} catch (e) {
			console.error(e)
			invalid(issue(t('newsletter_send_failed', undefined, locale)))
		}

		return { alreadySubscribed: false }
	},
)

/** Addresses we already mailed a request for, so a double submit is a no-op. */
const alreadySent = new Set<string>()
