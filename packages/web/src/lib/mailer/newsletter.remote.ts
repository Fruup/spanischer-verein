import { form, getRequestEvent } from '$app/server'
import { invalid } from '@sveltejs/kit'
import z from 'zod'
import { sendNewsletterRegistrationConfirmationLink } from './newsletter.server'
import { t } from '#lib/messages/index.ts'

export const subscribeToNewsletter = form(
	z.object({
		email: z.email({ error: () => t('invalid_email', undefined, getRequestEvent().locals.locale) }),
		acceptPrivacy: z.boolean().optional(),
	}),
	async ({ email, acceptPrivacy }, issue) => {
		const locale = getRequestEvent().locals.locale

		if (!acceptPrivacy) {
			invalid(issue.acceptPrivacy(t('newsletter_privacy_required', undefined, locale)))
		}

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
