import type { Locale } from './lib/locale'

declare global {
	namespace App {
		interface Error {
			errorCode?:
				'UNKNOWN' | 'NOT_FOUND' | 'SEND_EMAIL_FAILED' | 'INVALID_PARAMETERS' | 'TOO_MANY_REQUESTS'
		}

		interface Locals {
			locale: Locale
			isAdmin: boolean
		}

		interface PageData {
			locale: Locale
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {}
