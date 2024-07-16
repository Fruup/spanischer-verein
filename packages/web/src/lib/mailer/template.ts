export function generateRegistrationRequestHtml(mail: string) {
	return `
		<h1>Spanischer Verein</h1>
		<p>
			Eine neue Newsletter-Anmeldung ist eingegangen: <br />
			${mail}
		</p>
		<hr />
		<p>
			Diese Mail wurde automatisch versendet.
		</p>
	`
}
