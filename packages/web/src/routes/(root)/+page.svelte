<script lang="ts">
	import { page } from '$app/stores'
	import EventCard from '$lib/components/EventCard.svelte'

	const { posts: _posts } = $page.data
	const posts = [..._posts, ..._posts.reverse()]

	const postsLeft = $derived(posts.slice(0, posts.length / 2))
	const postsRight = $derived(posts.slice(posts.length / 2))
</script>

<h1 hidden>Upcoming Events</h1>

<nav>
	<ul>
		{#each postsLeft as event, i}
			<li>
				<article>
					<EventCard {event} />
				</article>
			</li>
		{/each}
	</ul>

	<ul>
		{#each postsRight as event, i}
			<li>
				<article>
					<EventCard {event} />
				</article>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
