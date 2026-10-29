<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte'

	interface Props {
		portableText: CustomBlockComponentProps<any>
	}

	let { portableText }: Props = $props()

	const value = $derived(portableText.value)
	const asset = $derived(value.asset)

	const url = $derived(value.transformedImageUrl || asset?.url)
	const dimensions = $derived(asset?.metadata?.dimensions)

	// Darkened the same way the hero and the overview cards do it, so an image
	// that does not fill the frame sits on a ground taken from the image itself.
	const prominentColor = $derived(asset?.metadata?.palette?.dominant?.background)
	const backgroundColor = $derived(
		prominentColor && `oklch(from ${prominentColor} calc(l * 0.8) c h)`,
	)

	// Neither is in the schema yet, but Sanity writes them as soon as the image
	// type gains the fields, and an empty alt keeps the image decorative here.
	const alt = $derived(value.alt ?? '')
	const caption = $derived(value.caption)
</script>

<!--
	The same frame the event hero uses: a fixed-height panel that an image of any
	shape can sit inside without cropping, over a blurred copy of itself.
-->
<figure class="my-8!">
	<div
		style:background-color={backgroundColor}
		class="relative flex max-h-[32rem] justify-center overflow-hidden rounded-panel shadow-raised"
	>
		<img
			src={url}
			alt=""
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 m-0 size-full scale-110 object-cover opacity-60 blur-2xl select-none"
		/>

		<img
			src={url}
			{alt}
			width={dimensions?.width}
			height={dimensions?.height}
			class="relative m-px max-h-[32rem] w-auto max-w-full object-contain"
		/>
	</div>

	{#if caption}
		<figcaption class="mt-3 text-center text-xs text-ink-muted">
			{caption}
		</figcaption>
	{/if}
</figure>
