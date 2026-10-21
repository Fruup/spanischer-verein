<script lang="ts">
	import type { InputValue } from '@portabletext/svelte'
	import { ArrowLeftIcon } from '@lucide/svelte'
	import { fly } from 'svelte/transition'

	import { duration, motion } from '#lib/helpers/motion.js'

	import EventHero, { type HeroImageSpec } from './event-hero.svelte'
	import EventInfo, { type EventInfoSpec } from './event-info.svelte'
	import BlockContent from './block-content/block-content.svelte'

	interface Props {
		title: string
		body: InputValue
		eventInfo?: EventInfoSpec | undefined
		image?: HeroImageSpec | undefined
		/** Shown as a back link above and below the article. */
		backHref?: string | undefined
	}

	let {
		title,
		body,
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

	<BlockContent {body} />

	{#if backHref}
		<footer class="mt-12 border-t border-hairline pt-6">
			<a
				href={backHref}
				class="group inline-flex items-center gap-1.5 rounded text-xs text-ink-muted focus-ring transition-colors hover:text-brand"
			>
				<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-0.5" />
				Alle Veranstaltungen
			</a>
		</footer>
	{/if}
</article>
