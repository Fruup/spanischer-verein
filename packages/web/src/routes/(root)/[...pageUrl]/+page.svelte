<script lang="ts">
	import { page as pageState } from '$app/state'

	import Page from '#lib/components/page.svelte'
	import { getPage } from '#lib/api/content-api.remote.js'
	import { t } from '#lib/messages/index.ts'

	const page = $derived(await getPage(pageState.params.pageUrl?.split('/') ?? []))
</script>

<svelte:head>
	<title>{page.title} - Spanischer Verein Köln</title>
</svelte:head>

<Page title={page.title} content={page.content} backHref="/" backLabel={t('back_to_home')} />
