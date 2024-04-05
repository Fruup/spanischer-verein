<script lang="ts">
	import Page from '$lib/components/Page.svelte'

	export let data
	$: title = data.page.title
	$: body = data.page.body
</script>

<Page {title} {body} />
