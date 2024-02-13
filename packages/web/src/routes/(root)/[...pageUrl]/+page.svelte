<script lang="ts">
	import BlockContent from '$lib/components/blockContent/BlockContent.svelte'

	export let data

	$: page = data.page
</script>

<div class="content-page">
	<h1>
		{page.title}
	</h1>

	<BlockContent body={page.body} />
</div>

<style lang="scss">
	h1 {
		text-align: center;
	}
</style>
