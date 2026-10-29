<script lang="ts">
	import type { MarkComponentProps } from '@portabletext/svelte'
	import type { InternalLinkMark } from '@spanischer-verein/sanity/schemas/blockContent'

	import IconBulb from '../icons/icon-bulb.svelte'
	import IconCalendar from '../icons/icon-calendar.svelte'

	interface Props {
		portableText: MarkComponentProps<InternalLinkMark>
	}

	let { portableText }: Props = $props()

	let resolvedReference = $derived(portableText.value.resolvedReference)
	let type = $derived(resolvedReference._type)
	let href = $derived.by(() => {
		switch (type) {
			case 'event':
				return `/event/${resolvedReference.slug}`
			case 'page':
				return `/${resolvedReference.slug}`
		}
	})
</script>

<a
	{href}
	class="inline-flex items-center gap-[0.25ch] rounded-full border border-edge-subtle bg-chip pr-[0.6em] pl-[0.4em] text-[0.9em] focus-ring transition-colors hover:border-brand/60 hover:bg-chip-hover"
>
	<span class="contents text-[0.8em]">
		{#if type === 'event'}
			<IconCalendar />
		{:else if type === 'page'}
			<IconBulb />
		{/if}
	</span>

	<span>
		{portableText.plainTextContent}
	</span>
</a>
