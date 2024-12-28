import { sanityApi } from '$lib/sanity/client'

export const load = async ({}) => {
	const siteSettings = await sanityApi.getSiteSettings()

	return {
		siteSettings,
	}
}
