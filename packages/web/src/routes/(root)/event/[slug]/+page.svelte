<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import type { EventInfoSpec } from '$lib/components/EventInfo.svelte'

	let { data } = $props()
	let title = $derived(data.event.title)
	let body = $derived(data.event.body)

	let eventInfo = $derived({
		admission: data.event.eventAdmission,
		time: data.event.eventTime,
		location: data.event.eventLocation,
	} satisfies EventInfoSpec)
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {title} {body} {eventInfo} />
