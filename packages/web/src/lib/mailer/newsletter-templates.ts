import { escapeHtml, highlightBox, paragraph, link, renderEmailLayout } from './layout'
import { ORIGIN } from '$app/env/private'

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

export function generateNewsletterRegistrationConfirmationHtml(token: string) {
	const linkUrl = url(`/newsletter/register?token=${escapeHtml(token)}`)

	return renderEmailLayout({
		title: 'Newsletter-Anmeldung',
		preheader: ``,
		heading: 'Newsletter-Anmeldung Spanischer Verein',
		intro: paragraph('Klicke diesen Link, um dich zu unserem Newsletter anzumelden:'),
		highlight: highlightBox(`${link(linkUrl, 'Zum Newsletter anmelden')}`),
		footerNote: '',
	})
}

const url = (relative: string) => new URL(relative, ORIGIN).href
