<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let events: PageData['events']
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
		width: 100%;
	}

	ul {
		width: 100%;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 1.5rem;

		margin: 0;
		padding: 0;
	}

	li {
		list-style: none;
	}

	li,
	article {
		height: 100%;
	}
</style>
