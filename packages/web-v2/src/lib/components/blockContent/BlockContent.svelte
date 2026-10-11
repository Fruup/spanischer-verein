<script lang="ts">
	import { PortableText, type InputValue, type PortableTextComponents } from '@portabletext/svelte'

	import EventInfoBlock from './EventInfoBlock.svelte'
	import ImageBlock from './ImageBlock.svelte'
	import InternalReference from './InternalReference.svelte'

	interface Props {
		body: InputValue
	}

	let { body }: Props = $props()

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

<div
	class="[&_h2]:text-center [&_h2]:font-serif [&_h3]:text-center [&_h3]:font-serif [&_h4]:text-center [&_h4]:font-serif [&_h5]:text-center [&_h5]:font-serif [&_h6]:text-center [&_h6]:font-serif [&_p]:my-4 [&_p]:overflow-auto [&_p]:break-words [&>*]:my-4"
>
	<PortableText {components} value={body} />
</div>
