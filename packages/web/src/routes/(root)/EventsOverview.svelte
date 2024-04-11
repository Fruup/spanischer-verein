<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let events: PageData['events']

	let numColumns = Math.min(2, events?.length)

	function getColumnEvents(columnIndex: number) {
		return events.filter((_, i) => i % numColumns === columnIndex)
	}

	function handleResize() {
		if (window.visualViewport!.width < 666) numColumns = 1
		else numColumns = Math.min(2, events?.length)
	}

	onMount(() => {
		handleResize()
	})
</script>

<nav style:--num-columns={numColumns}>
	{#each { length: numColumns } as _, columnIndex}
		<ul>
			{#each getColumnEvents(columnIndex) as event, i}
				{@const introDelay = (columnIndex + i) * 100}

				<li>
					<article>
						<EventCard {introDelay} {event} />
					</article>
				</li>
			{/each}
		</ul>
	{/each}
</nav>

<style lang="scss">
	nav {
		display: grid;
		grid-template-columns: repeat(var(--num-columns), 1fr);
		gap: 2rem;

		width: fit-content;
		margin: auto;
	}

	ul {
		width: 100%;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		margin: 0 auto;
		padding: 0;

		// max-width: 400px;
	}

	li {
		list-style: none;
	}
</style>
