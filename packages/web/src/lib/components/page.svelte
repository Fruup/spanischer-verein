<script lang="ts">
	import { fly } from 'svelte/transition'

	import { duration, motion } from '#lib/helpers/motion.js'

	import BackLink from './back-link.svelte'
	import EventHero from './event-hero.svelte'
	import EventInfo, { type EventInfoSpec } from './event-info.svelte'
	import BlockContent from './block-content/block-content.svelte'
	import type { ContentApi } from '#lib/api/content-api.types.ts'

	interface Props {
		title: string
		content: ContentApi.Content
		eventInfo?: EventInfoSpec | undefined
		image?: ContentApi.Image | undefined
		/** Shown as a back link above and below the article. */
		backHref?: string | undefined
		/** Label for both back links. Defaults to the events overview label. */
		backLabel?: string | undefined
	}

	let {
		title,
		content,
		eventInfo = undefined,
		image = undefined,
		backHref = undefined,
		backLabel = undefined,
	}: Props = $props()
</script>

<article
	in:fly={{ y: 10, duration: motion(duration.slow) }}
	class="mx-auto w-full max-w-[52rem] pb-4"
>
	<EventHero
		{title}
		{image}
		{backHref}
		{backLabel}
		time={eventInfo?.time}
		cancelled={eventInfo?.cancelled ?? false}
	/>

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
			<BackLink href={backHref} label={backLabel} />
		</footer>
	{/if}
</article>
