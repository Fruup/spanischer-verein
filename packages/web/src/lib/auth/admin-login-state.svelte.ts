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

		this.#authenticated = /(?:^|;\s*)SESSION_TOKEN_PLACEHOLDER=/.test(document.cookie)
	}
}

export const adminLoginState = new AdminLoginState()
