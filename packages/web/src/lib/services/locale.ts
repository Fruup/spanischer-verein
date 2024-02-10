import { readable } from 'svelte/store'

let setter: (locale: string) => void

export const setLocale = (locale: string) => {
	setter?.(locale)
}

export const locale = readable('en-GB', (set) => {
	setter = set
})
