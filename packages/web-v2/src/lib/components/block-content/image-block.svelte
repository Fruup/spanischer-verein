<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	interface Props {
		portableText: CustomBlockComponentProps<any>
	}

	let { portableText }: Props = $props()

	let url = $derived(portableText.value.transformedImageUrl || portableText.value.asset.url)
	let ratio = $derived(portableText.value.asset.metadata.dimensions.aspectRatio)
	const alt = '' // TODO

	const width = 500
	let height = $derived(width / ratio)
</script>

<!-- One container is used for centering, one for applying border radius and shadow. -->
<div class="h-fit w-full overflow-visible!">
	<div class="mx-auto h-fit w-fit text-center">
		<img
			src={url}
			{alt}
			{width}
			{height}
			class="mx-auto h-auto w-full max-w-[500px] rounded-base shadow-soft"
		/>
	</div>
</div>
