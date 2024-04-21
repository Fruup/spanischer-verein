<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	export let portableText: CustomBlockComponentProps

	$: url = portableText.value.transformedImageUrl || portableText.value.asset.url
	$: ratio = portableText.value.asset.metadata.dimensions.aspectRatio
	const alt = '' // TODO

	const width = 500
	const height = width / ratio
</script>

<div class="image-container">
	<img src={url} {alt} {width} {height} />
</div>

<style>
	.image-container {
		width: 100%;

		text-align: center;
	}

	img {
		width: 100%;
		max-width: 500px;
		height: auto;
	}
</style>
