<script lang="ts">
	import { PortableText, type InputValue, type PortableTextComponents } from '@portabletext/svelte'

	import EventInfoBlock from './event-info-block.svelte'
	import ImageBlock from './image-block.svelte'
	import InternalReference from './internal-reference.svelte'

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
	class="[&_:is(h2,h3,h4,h5,h6)]:mt-10 [&_:is(h2,h3,h4,h5,h6)]:mb-4 [&_:is(h2,h3,h4,h5,h6)]:text-center [&_:is(h2,h3,h4,h5,h6)]:font-serif [&_:is(h4,h5,h6)]:text-md [&_h2]:text-xl [&_h3]:text-lg [&_p]:my-4 [&_p]:overflow-auto [&_p]:break-words [&>*]:my-4"
>
	<PortableText {components} value={body} />
</div>
