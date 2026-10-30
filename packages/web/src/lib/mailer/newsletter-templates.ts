import { escapeHtml, highlightBox, paragraph, link, renderEmailLayout } from './layout'
import { ORIGIN } from '$app/env/private'
import type { Locale } from '#lib/locale/index.ts'
import { t } from '#lib/messages/index.ts'

export function generateNewsletterRegistrationRequestHtml(mail: string) {
	return renderEmailLayout({
		title: 'Neue Newsletter-Anmeldung',
		preheader: `Neue Newsletter-Anmeldung: ${mail}`,
		heading: 'Neue Newsletter-Anmeldung',
		intro: paragraph('Eine neue Anmeldung für den Newsletter ist eingegangen.'),
		highlight: highlightBox(escapeHtml(mail)),
		footerNote: 'Diese Adresse wurde über das Anmeldeformular auf der Website eingetragen.',
	})
}

export function generateNewsletterRegistrationConfirmationHtml(token: string, locale: Locale) {
	const linkUrl = url(`/newsletter/register?token=${escapeHtml(token)}`)

	return renderEmailLayout({
		title: t('newsletter_registration_title', undefined, locale),
		preheader: ``,
		heading: t('email_confirm_heading', undefined, locale),
		intro: paragraph(t('email_confirm_intro', undefined, locale)),
		highlight: highlightBox(`${link(linkUrl, t('email_confirm_link_text', undefined, locale))}`),
		footerNote: '',
		lang: locale,
	})
}

const url = (relative: string) => new URL(relative, ORIGIN).href
