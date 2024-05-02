<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	export let portableText: CustomBlockComponentProps

	$: url = portableText.value.transformedImageUrl || portableText.value.asset.url
	$: ratio = portableText.value.asset.metadata.dimensions.aspectRatio
	const alt = '' // TODO

	const width = 500
	const height = width / ratio
</script>

<!-- One container is used for centering, one for applying border radius and shadow. -->
<div class="image-container-outer">
	<div class="image-container-inner">
		<img src={url} {alt} {width} {height} />
	</div>
</div>

<style lang="scss">
	@import 'vars';

	.image-container-outer {
		width: 100%;
		height: fit-content;
		overflow: visible !important;
	}

	.image-container-inner {
		width: fit-content;
		height: fit-content;
		margin: auto;

		text-align: center;
	}

	img {
		width: 100%;
		max-width: 500px;
		height: auto;

		margin-left: auto;
		margin-right: auto;

		border-radius: var(--border-radius);
		@include shadow;
	}
</style>
