import { SanityDocument, createClient } from '@sanity/client'
import type { PortableTextBlock } from '@portabletext/types'
import { build } from 'vite'

interface Post {
	_type: 'post'
	title: string
	slug: { current: string }
	showInNewsletter: boolean
	mainImage: {
		_type: 'image'
		asset: {
			_ref: string
			_type: 'reference'
		}
	}
	body: PortableTextBlock[]
}

async function buildNewsletter(post: SanityDocument<Post>) {
	console.log('*********** POST ***********')
	console.log(post)

	process.env['PUBLIC_POST_JSON'] = JSON.stringify(post)

	await build()

	await import('../scripts/postBuild.ts')
}

function sendNewsletter(htmlFile: string) {
	/**
	 * TODO
	 * - get recipients from Sanity
	 * - send emails
	 */
}

export function listenForPosts() {
	const client = createClient({
		apiVersion: 'v2022-03-07',
		projectId: '6a1nd7zb',
		perspective: 'published',
		// apiHost: 'http://localhost:3333',
		dataset: 'production',
		useCdn: true,
	})

	// Start listening for new posts.
	client
		.listen<Post>('*[_type == "post"]', {}, { includeResult: true, visibility: 'query' })
		.subscribe((event) => {
			if (event.type !== 'mutation') return
			if (event.transition !== 'appear') return

			const result = event.result!
			if (result.showInNewsletter === false) return

			console.log('*********** EVENT ***********')
			console.log(event)

			buildNewsletter(result)
		})
}

// "Wir stehen auch auf Listen, ganz weit unten." :D
