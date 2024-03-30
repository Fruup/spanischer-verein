<script lang="ts">
	import EventPage from '$lib/components/EventPage.svelte'

	export let data
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<div class="container">
	<EventPage event={data.event} />
</div>

<style lang="scss">
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 5rem;
	}
</style>
