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
	@import 'vars';

	nav {
		width: 100%;

		container-type: inline-size;

		--num-columns: 2;

		@include min-md {
			ul {
				--num-columns: 3;
			}
		}
	}

	ul {
		display: grid;
		grid-template-columns: repeat(var(--num-columns), 1fr);
		gap: 2rem;

		margin: 0;
		padding: 0;

		@include max-sm {
			--num-columns: 1 !important;
		}
	}

	li {
		list-style: none;

		:global(img) {
			max-height: 50vh;
		}
	}
</style>
