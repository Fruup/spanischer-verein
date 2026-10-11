<script lang="ts">
	import { page as pageState } from '$app/state'

	import Page from '#lib/components/page.svelte'
	import { getPage } from '#lib/sanity/sanity.remote.js'

	const page = await getPage(pageState.params.pageUrl ?? '')
</script>

<svelte:head>
	<title>{page.title} - Spanischer Verein Köln</title>
</svelte:head>

<Page title={page.title} body={page.body} />
