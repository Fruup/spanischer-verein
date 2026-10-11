/**
 * The locale used for formatting dates and times.
 *
 * v1 seeded this from the `Accept-Language` header inside `+layout.server.ts`,
 * which stored one visitor's locale in module scope on the server and leaked it
 * to the next request. It is now browser-only state, seeded from
 * `navigator.language` once the root layout mounts.
 */
let current = $state('en-GB')

export const locale = {
	get current() {
		return current
	},
	set(value: string) {
		current = value
	},
}
