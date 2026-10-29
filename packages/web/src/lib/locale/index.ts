export const locales = ['de', 'es'] as const
export type Locale = (typeof locales)[number]

export const isLocale = (locale: string): locale is Locale => locales.includes(locale as Locale)
