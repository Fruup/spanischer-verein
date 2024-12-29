import { sendNewsletter } from './mailchimp'
import type { NewsletterSchema } from '@spanischer-verein/sanity/schemas/newsletter'
import { client } from './sanity'
import { getHtmlForEmail } from './html'

const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) throw new Error('BASE_URL is not set')

const listId = import.meta.env.MAILCHIMP_LIST_ID!
if (!listId) throw new Error('MAILCHIMP_LIST_ID is not set')

export async function getUnsentNewsletters() {
	return await client.fetch<NewsletterSchema[]>(`
		*[_type == "newsletter" && !defined(sentAt)]{ ... }
	`)
}

export async function sendUnsentNewsletters() {
	const newsletters = await getUnsentNewsletters()

	console.log(`Sending ${newsletters.length} newsletters.`)

	for (const { _id, slug, title } of newsletters) {
		console.log(`Sending newsletter: ${title}`)

		try {
			const html = await getHtmlForEmail(`${BASE_URL}/newsletter/${slug.current}`)
			await sendNewsletter({ title, listId, html })

			// Mark as sent.
			{
				console.log('Patching document...')

				const patch = client.patch(_id, {
					set: {
						sentAt: new Date().toISOString,
					},
				})

				console.log(patch.serialize())

				const result = await patch.commit()

				console.log('Patch result:')
				console.log(JSON.stringify(result))
			}
		} catch (error) {
			console.error(error)
			console.error(JSON.stringify(error))
		}
	}
}
