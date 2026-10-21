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

<!--
	Article typography. Headings are left-aligned against the hero rather than
	centred, so a long body reads as one column instead of a stack of banners.
-->
<div
	class="[&_:is(h2,h3,h4,h5,h6)]:mt-10 [&_:is(h2,h3,h4,h5,h6)]:mb-3 [&_:is(h2,h3,h4,h5,h6)]:font-serif [&_:is(h2,h3,h4,h5,h6)]:font-bold [&_:is(h2,h3,h4,h5,h6)]:tracking-tight [&_:is(h2,h3,h4,h5,h6)]:text-balance [&_:is(h4,h5,h6)]:text-sm [&_:is(ol,ul)]:my-5 [&_:is(ol,ul)]:space-y-2 [&_:is(ol,ul)]:pl-6 [&_a]:underline [&_a]:decoration-brand/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-brand-link [&_a:hover]:decoration-brand [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-md [&_blockquote]:text-ink-muted [&_blockquote]:italic [&_h2]:text-lg [&_h3]:text-md [&_hr]:my-10 [&_hr]:border-hairline [&_li]:marker:text-brand [&_ol]:list-decimal [&_p]:my-5 [&_p]:break-words [&_strong]:font-semibold [&_ul]:list-disc [&>*]:my-5 [&>*:first-child]:mt-0"
>
	<PortableText {components} value={body} />
</div>
