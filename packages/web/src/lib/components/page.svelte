<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte'
	import { fly } from 'svelte/transition'

	import { duration, motion } from '#lib/helpers/motion.js'

	import EventHero from './event-hero.svelte'
	import EventInfo, { type EventInfoSpec } from './event-info.svelte'
	import BlockContent from './block-content/block-content.svelte'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		title: string
		content: ContentApi.Content
		eventInfo?: EventInfoSpec | undefined
		image?: ContentApi.Image | undefined
		/** Shown as a back link above and below the article. */
		backHref?: string | undefined
	}

	let {
		title,
		content,
		eventInfo = undefined,
		image = undefined,
		backHref = undefined,
	}: Props = $props()
</script>

<article
	in:fly={{ y: 10, duration: motion(duration.slow) }}
	class="mx-auto w-full max-w-[52rem] pb-4"
>
	<EventHero {title} {image} {backHref} time={eventInfo?.time} />

	{#if eventInfo}
		<EventInfo {eventInfo} />
	{/if}

	{#if content.type === 'sanity'}
		<BlockContent body={content.value} />
		<!-- TODO:  -->
		<!-- {:else if content.type === 'tiptap'} -->
	{/if}

	{#if backHref}
		<footer class="mt-12 border-t border-hairline pt-6">
			<a
				href={backHref}
				class="group inline-flex items-center gap-1.5 rounded text-xs text-ink-muted focus-ring transition-colors hover:text-brand"
			>
				<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-0.5" />
				{t('all_events')}
			</a>
		</footer>
	{/if}
</article>
