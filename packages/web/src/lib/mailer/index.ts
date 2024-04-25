import { env } from '$env/dynamic/private'
import { sanityApi } from '$lib/sanity/client'
import { createTransport, type Transporter } from 'nodemailer'
import { generatePreparationHtml, generateRegistrationRequestHtml } from './template'

let transporter: Transporter
let recipient: string | undefined

export async function sendNewsletterSubscriptionRequest(mail: string) {
	await init()
	await initRecipient()

	if (!recipient) throw Error(`No newsletter subscription recipient set.`)

	const html = generateRegistrationRequestHtml(mail)

	console.log(`Sending newsletter subscription request to ${recipient}...`)

	await transporter.sendMail({
		from: env.MAIL_USER,
		to: recipient,
		subject: 'Spanischer Verein - Neue Newsletteranmeldung',
		html,
	})
}

export async function sendNewsletterSubscriptionPreparation(options: {
	email: string
	origin?: string
}) {
	await init()

	const { email, origin = 'https://spanischerverin.com' } = options
	const html = generatePreparationHtml({ email, origin })

	console.log(`Sending newsletter preparation to ${email} using origin "${origin}"...`)

	await transporter.sendMail({
		from: env.MAIL_USER,
		to: email,
		subject: 'Spanischer Verein - Newsletteranmeldung',
		html,
	})
}

const parseIntSafely = (str: any) => {
	if (typeof str !== 'string') return undefined

	const n = parseInt(str)
	if (isNaN(n)) return undefined

	return n
}

async function init() {
	if (!transporter) {
		const user = env.MAIL_USER
		if (!user) throw Error(`MAIL_USER is not set`)

		const pass = env.MAIL_PASSWORD
		if (!pass) throw Error(`MAIL_PASSWORD is not set`)

		const host = env.MAIL_HOST || 'smtp.titan.email'
		const port = parseIntSafely(env.MAIL_PORT) || 587

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
