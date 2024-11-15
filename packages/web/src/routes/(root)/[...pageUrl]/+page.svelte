<script lang="ts">
	import Page from '$lib/components/Page.svelte'

	let { data } = $props()
	let title = $derived(data.page.title)
	let body = $derived(data.page.body)
</script>

<svelte:head>
	<title>{title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {title} {body} />
