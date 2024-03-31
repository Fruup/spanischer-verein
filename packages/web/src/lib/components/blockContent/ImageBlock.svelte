<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	export let portableText: CustomBlockComponentProps

	$: url = portableText.value.asset.url
	const alt = ''

	$: width = portableText.value.asset.metadata.dimensions.width
	$: height = portableText.value.asset.metadata.dimensions.height
	$: ratio = width / height
</script>

<div class="image-container">
	<img src={url} {alt} style:aspect-ratio={ratio} />
</div>

<style>
	.image-container {
		width: 100%;

		text-align: center;
	}

	img {
		max-width: 500px;
		height: auto;
	}
</style>
