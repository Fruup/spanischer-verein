import { createQueryStore } from '@sanity/core-loader'
import { sanityClient } from './client'
import { browser } from '$app/environment'

let store: ReturnType<typeof createQueryStore>

function initQueryStore() {
	if (!store) {
		store = createQueryStore({
			client: sanityClient,
			// ssr: false,
		})
	}
}

export function useLoader<QueryResponseResult = unknown, QueryResponseError = unknown>(options: {
	query: string
	initial?: QueryResponseResult
	onData?: (data: QueryResponseResult | undefined) => void
	onError?: (error: QueryResponseError) => void
}) {
	initQueryStore()

	if (browser) {
		store.enableLiveMode({})
	}

	const { query, initial, onError, onData } = options

	let state = $state(initial)
	const fetcher = store.createFetcherStore<QueryResponseResult, QueryResponseError>(
		query,
		// undefined,
		// {
		// 	data: initial,
		// 	perspective: 'raw',
		// },
	)

	const stopListening = fetcher.subscribe((value, changedKey) => {
		if (changedKey === 'error' && value.error) {
			onError?.(value.error)
			return
		}

		if (changedKey === 'data') {
			// if (JSON.stringify(state) === JSON.stringify(value.data)) return

			onData?.(value.data)
			state = value.data
			console.log('value.data', value.data)
			return
		}
	})

	return {
		get state() {
			return state
		},
		fetcher,
		stopListening,
	}
}
