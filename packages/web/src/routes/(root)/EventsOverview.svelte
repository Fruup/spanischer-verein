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

<nav>
	<ul>
		{#each events as event, i}
			{@const introDelay = i * 100}

			<li>
				<article>
					<EventCard {introDelay} {event} />
				</article>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		width: fit-content;
		margin: auto;
	}

	ul {
		// width: 100%;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;

		margin: 0 auto;
		padding: 0;
	}

	li {
		list-style: none;
		flex-grow: 1;
		max-width: 230px;
	}
</style>
