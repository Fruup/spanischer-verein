<script lang="ts">
	import EventPage from '$lib/components/EventPage.svelte'

	export let data
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<EventPage event={data.event} />
