import { sanityApi } from '$lib/sanity/client'
import { createTransport, type Transporter } from 'nodemailer'
import { generateRegistrationRequestHtml } from './template'
import { getMailingInfo } from './credentials'

let transporter: Transporter
let recipient: string | undefined
let sender: string | undefined

export async function sendNewsletterSubscriptionRequest(mail: string) {
	await init()
	await initRecipient()

	if (!recipient) throw Error(`No newsletter subscription recipient set.`)
	if (!sender) throw Error(`No sender email set.`)

	const html = generateRegistrationRequestHtml(mail)

	console.log(`Sending newsletter subscription request to ${recipient}...`)

	await transporter.sendMail({
		from: sender,
		to: recipient,
		subject: 'Spanischer Verein - Neue Newsletteranmeldung',
		html,
	})
}

async function init() {
	if (!transporter) {
		const { user, password: pass, host, port } = await getMailingInfo()

		sender = user

		transporter = createTransport({
			host,
			port,
			auth: {
				user,
				pass,
			},
		})

		if (!(await transporter.verify())) {
			throw Error(`Failed to verify connection to mail server.`)
		}
	}
}

async function initRecipient() {
	if (!recipient) {
		recipient = await sanityApi.getNewsletterSubscriptionRecipient()
	}
}
