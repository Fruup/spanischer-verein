<script lang="ts">
	import EventPage from '$lib/components/EventPage.svelte'

	export let data
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<div class="event-page-container">
	<EventPage event={data.event} />
</div>

<style lang="scss">
	.event-page-container {
		margin-top: 2rem;
	}
</style>
