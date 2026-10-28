import { escapeHtml, highlightBox, paragraph, renderEmailLayout } from './layout'

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
