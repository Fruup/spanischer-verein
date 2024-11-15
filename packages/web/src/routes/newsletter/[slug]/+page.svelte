<script lang="ts">
	import type { EventInfoSpec } from '$lib/components/EventInfo.svelte'
	import Page from '$lib/components/Page.svelte'

	let { data } = $props()
	let body = $derived(data.event.body)
	let title = $derived(data.event.title)
	let eventInfo = $derived({
		admission: data.event.eventAdmission,
		time: data.event.eventTime,
		location: data.event.eventLocation,
	} satisfies EventInfoSpec)
</script>

<svelte:head>
	<title>{title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {body} {title} {eventInfo} />
