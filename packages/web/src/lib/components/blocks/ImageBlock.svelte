<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	const { portableText } = $props<{
		portableText: CustomBlockComponentProps
	}>()

	const url = $derived(portableText.value.asset.url)
	const alt = ''

	const width = $derived(portableText.value.asset.metadata.dimensions.width)
	const height = $derived(portableText.value.asset.metadata.dimensions.width)
	const ratio = $derived(height / width)
</script>

<img src={url} {alt} style:ratio />

<style>
	img {
		width: 100%;
		height: auto;
	}
</style>
