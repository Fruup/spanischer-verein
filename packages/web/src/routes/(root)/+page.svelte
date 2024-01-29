<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte'
	import type { PageData } from './$types'

	const { data } = $props<{ data: PageData }>()

	// This is necessary to prevent a bug.
	$inspect(data)

	const events = $derived(data.events)
	const numColumns = 3

	function getColumnEvents(columnIndex: number) {
		return events.filter((_, i) => i % numColumns === columnIndex)
	}
</script>

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
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		margin: 0;
		padding: 0;
	}

	li {
		list-style: none;
	}
</style>
