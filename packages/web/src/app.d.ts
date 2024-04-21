// See https://kit.svelte.dev/docs/types#app

import type { PortableTextBlock } from '@portabletext/types'

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorCode: 'NOT_FOUND'
		}

		// interface Locals {}

		interface PageState {
			isMainMenuOpen?: boolean
		}

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

declare module '*&imagetools' {
	/**
	 * actual types
	 * - code https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/output-formats.ts
	 * - docs https://github.com/JonasKruckenberg/imagetools/blob/main/docs/guide/getting-started.md#metadata
	 */
	const out
	export default out
}
