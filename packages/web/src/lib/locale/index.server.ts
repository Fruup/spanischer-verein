import type { RequestEvent } from '@sveltejs/kit'
import { isLocale, locales, type Locale } from '.'

export const resolveLocale = (event: RequestEvent): Locale => {
	const fromCookie = event.cookies.get('locale')
	if (fromCookie && isLocale(fromCookie)) return fromCookie

	// "en-US,en;q=0.9"
	const fromHeader = event.request.headers
		.get('accept-language')
		?.split(/[,;]/g)
		.find((locale) => locales.some((other) => locale === other || locale.startsWith(`${other}-`)))
		?.split('-')
		.at(0)
	if (fromHeader && isLocale(fromHeader)) return fromHeader as Locale

	return 'de'
}
