<script lang="ts">
	import Page from '$lib/components/Page.svelte'

	export let data
	$: title = data.page.title
	$: body = data.page.body
</script>

<svelte:head>
	<title>{title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {title} {body} />
