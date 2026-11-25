<script lang="ts">
	import { CalendarIcon, LightbulbIcon } from '@lucide/svelte'
	import type { MarkComponentProps } from '@portabletext/svelte'
	import type { InternalLinkMark } from '@spanischer-verein/sanity/schemas/blockContent'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		portableText: MarkComponentProps<InternalLinkMark>
	}

	let { portableText }: Props = $props()

	let resolvedReference = $derived(portableText.value.resolvedReference)
	let type = $derived(resolvedReference._type)
	let cancelled = $derived(type === 'event' && resolvedReference.cancelled === true)
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
			<CalendarIcon class="size-4" />
		{:else if type === 'page'}
			<LightbulbIcon class="size-4" />
		{/if}
	</span>

	<span class={[cancelled && 'line-through']}>
		{portableText.plainTextContent}
	</span>

	{#if cancelled}
		<!-- The strikethrough alone says nothing to a screen reader. -->
		<span class="sr-only">{t('cancelled')}</span>
	{/if}
</a>
