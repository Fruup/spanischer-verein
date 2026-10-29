import { AccountApi, SendApi, Configuration, type V1SendRequest } from 'hostinger-mail-api-sdk'
import {
	HOSTINGER_MAIL_ADDRESS,
	HOSTINGER_MAIL_SENDER,
	HOSTINGER_MAIL_API_TOKEN,
} from '$app/env/private'

export const mailer = {
	async send({ html, to, subject }: { html: string; to: string; subject: string }) {
		const { mailboxResourceId, send } = await get()

		// TODO: move to raw fetch to remove dependency
		await send.sendEmail(
			mailboxResourceId,
			// @ts-expect-error - V1SendRequest requires ALL properties, which is wrong
			{
				displayName: HOSTINGER_MAIL_SENDER,
				to: [to],
				html,
				subject,
			} as Partial<V1SendRequest>,
		)
	},
}

let instance: { account: AccountApi; send: SendApi; mailboxResourceId: string } | null = null

const get = async () => {
	if (!instance) {
		const configuration = new Configuration({
			accessToken: HOSTINGER_MAIL_API_TOKEN,
		})
		const account = new AccountApi(configuration)
		const send = new SendApi(configuration)

		const { data } = await account.getCurrentAccount()

		const mailboxResourceId = data.data.mailboxes.find(
			({ address }) => address === HOSTINGER_MAIL_ADDRESS,
		)?.resourceId
		if (!mailboxResourceId) throw new Error('Mailbox not found')

		instance = {
			account,
			send,
			mailboxResourceId,
		}
	}

	return instance!
}
