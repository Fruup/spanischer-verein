<script lang="ts">
	import type { EventInfoSpec } from '$lib/components/EventInfo.svelte'
	import Page from '$lib/components/Page.svelte'

	export let data
	let {
		event: { body, title, eventAdmission, eventLocation, eventTime },
	} = data

	$: eventInfo = {
		admission: eventAdmission,
		time: eventTime,
		location: eventLocation,
	} satisfies EventInfoSpec
</script>

<svelte:head>
	<title>{title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {body} {title} {eventInfo} />
