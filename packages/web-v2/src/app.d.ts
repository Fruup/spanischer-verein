// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorCode?:
				'UNKNOWN' | 'NOT_FOUND' | 'SEND_EMAIL_FAILED' | 'INVALID_PARAMETERS' | 'TOO_MANY_REQUESTS'
		}

		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
