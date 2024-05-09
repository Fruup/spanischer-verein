import { env } from '$env/dynamic/private'

export async function getMailingInfo(): Promise<{
	user: string
	password: string
	host: string
	port: number
}> {
	if (!env.MAIL_CREDENTIALS) throw Error(`No mail credentials set (MAIL_CREDENTIALS).`)
	if (!env.MAIL_SERVER) throw Error(`No mail server set (MAIL_SERVER).`)

	const [user, ...passwordParts] = env.MAIL_CREDENTIALS.split(':')
	const [host, port] = env.MAIL_SERVER.split(':')

	return {
		user,
		password: passwordParts.join(''),
		host,
		port: Number(port),
	}
}
