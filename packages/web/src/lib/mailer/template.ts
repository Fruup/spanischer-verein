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

export function generatePreparationHtml(options: { email: string; origin: string }) {
	return `
		<h1>Spanischer Verein - Newsletteranmeldung</h1>
		<p>
			Cool, dass Du dabei sein möchtest!
			<br />
			Klicke den folgenden Link, um Deine Anmeldung zu bestätigen:
			
			<br />
			<br />

			${options.origin}/newsletter/register?email=${encodeURIComponent(options.email)}
		</p>
	`
}
