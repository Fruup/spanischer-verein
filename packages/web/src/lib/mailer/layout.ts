export const BRAND = '#b32024'
export const INK = '#1a1a1a'
export const MUTED = '#6b7280'
export const BORDER = '#e5e7eb'

const SANS = `-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`
export const MONO = `'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace`

export function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

/** Body copy paragraph. Pass already-escaped HTML. */
export function paragraph(html: string) {
	return `<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">${html}</p>`
}

/** Centerpiece line, used for the OTP code and the signup address. No frame. */
export function highlightBox(html: string, { mono = false } = {}) {
	return `<p style="margin:0;font-family:${mono ? MONO : SANS};font-size:${mono ? '28px' : '17px'};line-height:1.2;font-weight:700;color:${INK};${mono ? 'letter-spacing:8px;text-indent:8px;' : ''}white-space:nowrap;">${html}</p>`
}

export function link(href: string, text: string) {
	return `<a href="${href}" style="color:${BRAND};text-decoration:none;">${text}</a>`
}

export function renderEmailLayout({
	title,
	preheader,
	heading,
	intro,
	highlight,
	note,
	footerNote,
}: {
	title: string
	/** Inbox preview line. Hidden inside the body. */
	preheader: string
	heading: string
	/** HTML placed under the heading. */
	intro: string
	/** Optional centerpiece, e.g. from `highlightBox`. */
	highlight?: string
	/** Optional small line under the highlight. */
	note?: string
	footerNote: string
}) {
	return `<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<meta name="color-scheme" content="light only" />
		<title>${escapeHtml(title)}</title>
	</head>
	<body style="margin:0;padding:0;background:#ffffff;">
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td align="center" style="padding:40px 20px;">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">
						<tr>
							<td style="font-family:${SANS};">
								<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${BRAND};">Spanischer Verein</p>
								<h1 style="margin:14px 0 0;font-size:20px;line-height:1.35;font-weight:700;color:${INK};">${escapeHtml(heading)}</h1>
								${intro}
							</td>
						</tr>${
							highlight
								? `
						<tr>
							<td style="padding:28px 0 0;font-family:${SANS};">
								${highlight}
							</td>
						</tr>`
								: ''
						}${
							note
								? `
						<tr>
							<td style="padding:10px 0 0;font-family:${SANS};">
								<p style="margin:0;font-size:13px;color:${MUTED};">${note}</p>
							</td>
						</tr>`
								: ''
						}
						<tr>
							<td style="padding:32px 0 0;font-family:${SANS};">
								<div style="height:1px;background:${BORDER};line-height:1px;font-size:0;">&nbsp;</div>
								<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">${footerNote}</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`
}
