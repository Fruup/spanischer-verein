<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte'
	import { onMount } from 'svelte'

	export let data

	$: events = data.events
	let numColumns = 2

	function getColumnEvents(columnIndex: number) {
		return events.filter((_, i) => i % numColumns === columnIndex)
	}

	function handleResize() {
		if (window.visualViewport!.width < 666) numColumns = 1
		else numColumns = 2
	}

	onMount(() => {
		handleResize()
	})
</script>

<svelte:window on:resize={handleResize} />

<h1 hidden>Upcoming Events</h1>

{#if !events.length}
	<p style:text-align="center">Keine Veranstaltungen in nächster Zeit</p>
{/if}

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
		display: flex;
		flex-direction: column;
		gap: 2rem;

		margin: 0 auto;
		padding: 0;

		max-width: 400px;
	}

	li {
		list-style: none;
	}
</style>
