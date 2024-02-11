<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	export let portableText: CustomBlockComponentProps

	$: url = portableText.value.asset.url
	const alt = ''

	$: width = portableText.value.asset.metadata.dimensions.width
	$: height = portableText.value.asset.metadata.dimensions.width
	$: ratio = height / width
</script>

<img src={url} {alt} style:ratio />

<style>
	img {
		width: 100%;
		height: auto;
	}
</style>
