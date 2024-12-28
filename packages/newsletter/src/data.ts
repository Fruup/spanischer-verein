import { minify } from 'html-minifier'
import { sendNewsletter } from './mailchimp'
import type { NewsletterSchema } from '@spanischer-verein/sanity/schemas/newsletter'
import { client } from './sanity'

const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) throw new Error('BASE_URL is not set')

const listId = import.meta.env.MAILCHIMP_LIST_ID!
if (!listId) throw new Error('MAILCHIMP_LIST_ID is not set')

export async function getUnsentNewsletters() {
	return await client.fetch<NewsletterSchema[]>(`
		*[_type == "newsletter" && !defined(sentAt)]{ ... }
	`)
}

async function getNewsletterHtml(slug: string) {
	const response = await fetch(`${BASE_URL}/newsletter/${slug}`)
	const html = await response.text()

	return minify(html, {
		minifyCSS: true,
		removeComments: true,
		collapseWhitespace: true,
		preserveLineBreaks: false,
	})
}

export async function sendUnsentNewsletters() {
	const newsletters = await getUnsentNewsletters()

	console.log(`Sending ${newsletters.length} newsletters.`)

	for (const { _id, slug, title } of newsletters) {
		console.log(`Sending newsletter: ${title}`)

		try {
			const html = await getNewsletterHtml(slug.current)
			await sendNewsletter({ title, listId, html })

			// Mark as sent.
			await client
				.patch(_id, {
					set: {
						sentAt: new Date().toISOString(),
					},
				})
				.commit()
		} catch (error) {
			console.error(error)
		}
	}
}
