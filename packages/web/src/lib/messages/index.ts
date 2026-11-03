import { locale } from '#lib/locale/state.svelte.ts'
import type { Locale } from '#lib/locale/index.ts'
import { de } from './de'
import { es } from './es'
import { building } from '$app/env'

const messages = {
	de,
	es,
}

type MessageKey = keyof (typeof messages)['de']

/**
 * `locale_` defaults to the client-side locale store, which is unavailable
 * outside component/page context (e.g. in `.remote.ts` server handlers) —
 * those call sites must pass the request's locale explicitly.
 */
export const t = (
	key: MessageKey,
	params?: Record<string, string | number>,
	locale_: Locale = locale.current,
) => {
	const message = messages[locale_][key]
	if (!message) {
		if (building) throw new Error(`Missing message for key "${key}" in locale "${locale_}"`)
		if (locale_ !== 'de') return t(key, params, 'de')
		return `{${key} not found}`
	}
	if (!params) return message
	return message.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match))
}
