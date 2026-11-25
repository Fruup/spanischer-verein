import { page } from '$app/state'
import type { Locale } from '.'

let override = $state<Locale>()

export const locale = {
	get current() {
		return override ?? page.data.locale
	},
	set current(locale: Locale) {
		override = locale
	},
}
