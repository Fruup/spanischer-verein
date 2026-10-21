<script lang="ts">
	import EventCard from '#lib/components/event-card.svelte'
	import { getCurrentEventsOverview } from '#lib/sanity/sanity.remote.ts'
	import { DragGesture } from '@use-gesture/vanilla'

	const { events } = await getCurrentEventsOverview(0)
	const event = events[0]

	const createDragContainer = () => {
		let container = $state<HTMLElement>()
		let size = $state({ w: 300, h: 500 })

		$effect(() => {
			if (!container) return
			const target = container.querySelector('button')
			if (!target) return

			const { width, height } = getComputedStyle(container)
			size.w = Number(width.slice(0, -2))
			size.h = Number(height.slice(0, -2))

			const gesture = new DragGesture(target, ({ delta }) => {
				size.w += delta[0]
				size.h += delta[1]

				container!.style.width = `${size.w}px`
				container!.style.height = `${size.h}px`
			})

			return () => gesture.destroy()
		})

		return {
			get container() {
				return container
			},
			set container(value) {
				container = value
			},
			get size() {
				return size
			},
		}
	}

	const dc1 = createDragContainer()
	const dc2 = createDragContainer()
</script>

<div bind:this={dc1.container} class="relative m-10 border border-ink-muted/50 p-8">
	<EventCard {event} horizontal />

	<button class="absolute right-0 bottom-0 size-4 translate-1/2 rounded-full bg-ink-muted"></button>
</div>

<div bind:this={dc2.container} class="relative m-10 border border-ink-muted/50 p-8">
	<EventCard {event} />

	<button class="absolute right-0 bottom-0 size-4 translate-1/2 rounded-full bg-ink-muted"></button>
</div>
