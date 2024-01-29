<svelte:options runes={true} />

<script lang="ts">
	import EventPage from '$lib/components/EventPage.svelte'
	import type { PageData } from './$types'

	let { data } = $props<{ data: PageData }>()

	// This is necessary to prevent a bug.
	$inspect(data)
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<EventPage event={data.event} />
