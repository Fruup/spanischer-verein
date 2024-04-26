import { env } from '$env/dynamic/private'
import { sanityApi } from '$lib/sanity/client'
import { SimpleCrypto } from 'simple-crypto-js'

export async function getMailingInfo(): Promise<{
	user: string
	password: string
	host: string
	port: number
}> {
	const secret = env.MAIL_CREDENTIALS_SECRET
	if (!secret) throw Error(`MAIL_CREDENTIALS_SECRET is not set`)

	const { credentials, host, port } = (await sanityApi.getMailingInfo()) ?? {}

	if (!host) throw Error(`No mail server host set.`)
	if (!port) throw Error(`No mail server port set.`)
	if (!credentials) throw Error(`No mail server credentials set.`)

	const nc = new SimpleCrypto(secret)

	const decryptSafely = () => {
		try {
			return nc.decrypt(credentials) as { user?: string; password?: string }
		} catch (e) {
			throw Error('Failed to decrypt mail server credentials.')
		}
	}

	const { user, password } = decryptSafely()

	if (!user) throw Error(`No mail server user set.`)
	if (!password) throw Error(`No mail server password set.`)

	return {
		user,
		password,
		host: host,
		port,
	}
}
