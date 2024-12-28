import { minify } from 'html-minifier'
import { sendNewsletter } from './src/mailchimp'

const base = 'http://localhost:5173'
const slug = 'test'
const listId = 'f1fc4c8883'

async function getNewsletterHtml() {
	const response = await fetch(`${base}/newsletter/${slug}`)
	const html = await response.text()

	return minify(html, {
		minifyCSS: true,
		removeComments: true,
		collapseWhitespace: true,
		preserveLineBreaks: false,
	})
}

const html = await getNewsletterHtml()
await sendNewsletter({ title: 'TODO: Campaign Title', listId, html })
