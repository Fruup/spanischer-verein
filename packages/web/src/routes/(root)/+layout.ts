import { setLocale } from '$lib/services/locale'
import { browser } from '$app/environment'

export const load = async ({ data }) => {
	if (browser) {
		setLocale(navigator.language)
	}

	return data
}
