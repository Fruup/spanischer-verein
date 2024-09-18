<script lang="ts">
	import { fly } from 'svelte/transition'
	import EventInfo, { type EventInfoSpec } from './EventInfo.svelte'
	import BlockContent from './blockContent/BlockContent.svelte'
	import type { PortableTextBlock } from '@sanity/types'

	export let title: string
	export let body: PortableTextBlock[]
	export let eventInfo: EventInfoSpec | undefined = undefined
</script>

<div class="page" in:fly={{ y: 10 }}>
	<div class="heading-container">
		<h2>
			{title}
		</h2>

		{#if eventInfo}
			<EventInfo {eventInfo} />
		{/if}
	</div>

	<BlockContent {body} />
</div>

<style lang="scss">
	@import 'vars';

	.page {
		h2 {
			@include font-serif;
			font-style: italic;
			text-wrap: balance;
			line-height: 1.33;
			font-size: 1.75rem;

			text-align: center;

			position: relative;

			width: fit-content;
			margin: auto;
			margin-bottom: 2rem;
		}
	}
</style>
