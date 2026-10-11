<script lang="ts">
	import EventCard from '#lib/components/EventCard.svelte'

	interface Props {
		events: {
			title: string
			slug: string
			imageUrl: string
			eventTime: string
			mainImageMeta: {
				prominentColor: string
				dimensions: { width: number; height: number }
			}
		}[]
	}

	let { events }: Props = $props()
</script>

<nav class="w-full">
	<ul
		class="grid w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6 p-0 max-tablet:grid-cols-1"
	>
		{#each events as event, i (event.slug)}
			{@const introDelay = i * 100}

			<li class="h-full list-none [&_img]:max-h-[50vh]">
				<article class="h-full">
					<EventCard {introDelay} {event} />
				</article>
			</li>
		{/each}
	</ul>
</nav>
