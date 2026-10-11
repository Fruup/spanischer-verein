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
	class="inline-flex items-center gap-[0.25ch] rounded-full bg-chip pr-[0.6em] pl-[0.4em] text-[0.9em] hover:bg-chip-hover hover:outline-2 hover:outline-brand"
>
	<span class="contents text-[0.8rem]">
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
