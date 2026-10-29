import { OTP_LENGTH } from './admin-login'
import { highlightBox, paragraph, renderEmailLayout } from '../mailer/layout'

export function generateOtpEmailHtml({
	otp,
	expiresInMinutes,
}: {
	otp: string
	expiresInMinutes: number
}) {
	if (otp.length !== OTP_LENGTH) throw new Error(`OTP must be ${OTP_LENGTH} digits`)

	return renderEmailLayout({
		title: 'Admin Login Code',
		preheader: `Dein Login-Code: ${otp} (${expiresInMinutes} Minuten gültig)`,
		heading: 'Dein Admin-Login-Code',
		intro: paragraph('Gib diesen Code im Login-Fenster ein, um fortzufahren.'),
		highlight: highlightBox(otp, { mono: true }),
		note: `Gültig für ${expiresInMinutes} Minuten.`,
		footerNote:
			'Du hast keinen Login angefordert? Dann ignoriere diese E-Mail – ohne den Code passiert nichts. Gib den Code niemals weiter.',
	})
}
