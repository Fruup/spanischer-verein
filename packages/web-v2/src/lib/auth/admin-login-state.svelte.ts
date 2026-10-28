import { browser } from '$app/env'

class AdminLoginState {
	constructor() {
		this.update()
	}

	#authenticated = $state(false)

	get authenticated() {
		return this.#authenticated
	}

	update() {
		if (!browser) return

		this.#authenticated = document.cookie.includes('SESSION_TOKEN_PLACEHOLDER=')
	}
}

export const adminLoginState = new AdminLoginState()
