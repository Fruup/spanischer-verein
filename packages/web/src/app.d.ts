// See https://kit.svelte.dev/docs/types#app

import type { PortableTextBlock } from '@portabletext/types'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageState {}
		// interface Platform {}

		interface PageData {
			events: any[]

			posts: {
				title: string
				slug: string
				imageUrl: string
				prominentColor: string
				excerpt: PortableTextBlock[]
			}[]
		}
	}
}

export {}
