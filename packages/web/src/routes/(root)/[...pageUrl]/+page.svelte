<script lang="ts">
	import Page from '$lib/components/Page.svelte'

	export let data
	let { body, title } = data.page
</script>

<Page {title} {body} />
