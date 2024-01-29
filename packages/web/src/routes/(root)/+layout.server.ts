export const load = async ({ request }) => {
	const languages = (request.headers.get('Accept-Language')?.split(',') ?? []).map((lang) => {
		const to = lang.indexOf(';')
		return lang.slice(0, to < 0 ? undefined : to)
	})

	console.log({ languages })

	return {
		languages,
	}
}
