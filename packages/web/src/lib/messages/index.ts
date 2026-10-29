import { locale } from '#lib/locale/state.svelte.ts'
import { de } from './de'
import { es } from './es'

const messages = {
	de,
	es,
}

export const t = (key: keyof (typeof messages)['de']) => {
	const message = messages[locale.current][key]
	if (!message) return `{${key} not found}`
	return message
}
