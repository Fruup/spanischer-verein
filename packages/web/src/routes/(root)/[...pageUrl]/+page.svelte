<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import { scrollAfterNavigate } from '$lib/helpers/scrolling.js'

	export let data
	$: title = data.page.title
	$: body = data.page.body

	scrollAfterNavigate()
</script>

<svelte:head>
	<title>{title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {title} {body} />
