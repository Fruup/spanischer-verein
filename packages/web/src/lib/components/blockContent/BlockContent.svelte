<script lang="ts">
	import { PortableText, type PortableTextComponents } from '@portabletext/svelte'
	import ImageBlock from './ImageBlock.svelte'
	import EventInfoBlock from './EventInfoBlock.svelte'
	import type { ComponentProps } from 'svelte'
	import InternalReference from './InternalReference.svelte'

	export let body: ComponentProps<PortableText>['value']

	const components: PortableTextComponents = {
		types: {
			image: ImageBlock,
			eventInfo: EventInfoBlock,
		},
		marks: {
			internalLink: InternalReference,
		},
	}
</script>

<div class="block-content">
	<PortableText {components} value={body} />
</div>

<style lang="scss">
	@import 'vars';

	.block-content {
		:global(> *) {
			margin: 1rem 0;
		}

		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			text-align: center;
			@include font-serif;
		}

		:global(p) {
			margin: 1rem 0;
		}

		:global(img) {
			max-width: 500px;
			margin-left: auto;
			margin-right: auto;
			border-radius: var(--border-radius);
			@include shadow;
		}
	}
</style>
