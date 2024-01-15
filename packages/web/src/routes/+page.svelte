<script lang="ts">
	import { page } from '$app/stores'

	const { events } = $page.data
</script>

<h1>Upcoming Events</h1>

<ul>
	{#each events as event}
		<li>
			<article>
				<h2>
					<a href="/post/{event.slug}">{event.title}</a>
				</h2>
			</article>
		</li>
	{/each}
</ul>
