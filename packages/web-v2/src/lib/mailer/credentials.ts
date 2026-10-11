import { MAIL_CREDENTIALS, MAIL_SERVER } from '$app/env/private'

export async function getMailingInfo(): Promise<{
	user: string
	password: string
	host: string
	port: number
}> {
	if (!MAIL_CREDENTIALS) throw Error(`No mail credentials set (MAIL_CREDENTIALS).`)
	if (!MAIL_SERVER) throw Error(`No mail server set (MAIL_SERVER).`)

	const [user, ...passwordParts] = MAIL_CREDENTIALS.split(':')
	const [host, port] = MAIL_SERVER.split(':')

	return {
		user,
		password: passwordParts.join(''),
		host,
		port: Number(port),
	}
}
