import { sanityApi } from '$lib/sanity/client'

export async function getMailingInfo(): Promise<{
	user: string
	password: string
	host: string
	port: number
}> {
	const { user, password, host, port } = (await sanityApi.getMailingInfo()) ?? {}

	if (!host) throw Error(`No mail server host set.`)
	if (!port) throw Error(`No mail server port set.`)
	if (!user) throw Error(`No mail server user set.`)
	if (!password) throw Error(`No mail server password set.`)

	return {
		user,
		password,
		host: host,
		port,
	}
}
