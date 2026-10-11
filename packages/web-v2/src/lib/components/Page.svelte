<script lang="ts">
	import type { InputValue } from '@portabletext/svelte'
	import { fly } from 'svelte/transition'

	import EventInfo, { type EventInfoSpec } from './EventInfo.svelte'
	import BlockContent from './blockContent/BlockContent.svelte'

	interface Props {
		title: string
		body: InputValue
		eventInfo?: EventInfoSpec | undefined
	}

	let { title, body, eventInfo = undefined }: Props = $props()
</script>

<div in:fly={{ y: 10 }}>
	<div>
		<h2
			class="relative mx-auto mb-8 w-fit text-center font-serif text-[1.75rem] leading-[1.33] text-balance italic"
		>
			{title}
		</h2>

		{#if eventInfo}
			<EventInfo {eventInfo} />
		{/if}
	</div>

	<BlockContent {body} />
</div>
