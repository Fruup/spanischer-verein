<script lang="ts">
	import type { InputValue } from '@portabletext/svelte'
	import { fly } from 'svelte/transition'

	import { duration, motion } from '#lib/helpers/motion.js'

	import EventInfo, { type EventInfoSpec } from './event-info.svelte'
	import BlockContent from './block-content/block-content.svelte'

	interface Props {
		title: string
		body: InputValue
		eventInfo?: EventInfoSpec | undefined
	}

	let { title, body, eventInfo = undefined }: Props = $props()
</script>

<div in:fly={{ y: 10, duration: motion(duration.slow) }}>
	<div>
		<h2 class="relative mx-auto mb-8 w-fit text-center font-serif text-xl text-balance italic">
			{title}
		</h2>

		{#if eventInfo}
			<EventInfo {eventInfo} />
		{/if}
	</div>

	<BlockContent {body} />
</div>
