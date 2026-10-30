import { getCurrentEventsOverview } from '#lib/api/content-api.remote.js'
import type { ContentApi } from '#lib/api/content-api.types.ts'

class EventsOverviewStore {
	async init() {
		if (this.#initialized) return
		const { events, hasMore } = await getCurrentEventsOverview(0)
		this.#events = events
		this.#hasMore = hasMore
		this.#initialized = true
	}

	#pageIndex = $state(0)
	#events = $state<ContentApi.Event[]>([])
	#hasMore = $state(false)
	#loading = $state(false)

	#initialized = false

	async loadMore() {
		this.#loading = true

		try {
			const overview = await getCurrentEventsOverview(this.#pageIndex + 1)

			this.#pageIndex++

			this.#events.push(...overview.events)
			this.#hasMore = overview.hasMore
		} catch (e) {
			console.error(e)
		} finally {
			this.#loading = false
		}
	}

	get events() {
		return this.#events
	}
	get hasMore() {
		return this.#hasMore
	}
	get loading() {
		return this.#loading
	}
}

export const eventsOverviewStore = new EventsOverviewStore()
