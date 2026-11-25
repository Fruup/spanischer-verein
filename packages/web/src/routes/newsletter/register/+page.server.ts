import { handleNewsletterRegistrationConfirmation } from '#lib/mailer/newsletter.server.js'

export const load = async ({ url }) => {
	const token = url.searchParams.get('token') ?? ''
	const confirmed = await handleNewsletterRegistrationConfirmation(token)
	return { confirmed }
}
