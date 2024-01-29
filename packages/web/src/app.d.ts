// See https://kit.svelte.dev/docs/types#app

import type { PortableTextBlock } from '@portabletext/types'

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorCode: 'NOT_FOUND'
		}

		// interface Locals {}
		// interface PageState {}
		// interface Platform {}

		interface PageData {
			// events: any[]
			// upcomingEvents: {
			// 	title: string
			// 	slug: string
			// 	eventTime: Date
			// 	eventLocation?: string
			// 	eventAdmission?: string
			// 	imageUrl: string
			// 	prominentColor: string
			// 	excerpt: PortableTextBlock[]
			// }[]
		}
	}
}

export {}
