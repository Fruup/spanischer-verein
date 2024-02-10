<script lang="ts">
	import { PortableText, type PortableTextComponents } from '@portabletext/svelte'
	import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
	import { fly } from 'svelte/transition'
	import EventInfo from './EventInfo.svelte'
	import ImageBlock from './blocks/ImageBlock.svelte'
	import EventInfoBlock from './blocks/EventInfoBlock.svelte'

	export let event: EventSchema

	const components: PortableTextComponents = {
		types: {
			image: ImageBlock,
			eventInfo: EventInfoBlock,
		},
	}

	$: body = event.body
	$: eventInfo = event.eventInfo
	$: title = event.title
	$: updatedAt = event._updatedAt
</script>

<div class="event-page" in:fly={{ y: 10 }}>
	<div class="heading-container">
		<h1>
			{title}
		</h1>

		{#if eventInfo}
			<EventInfo {eventInfo} />
		{/if}
	</div>

	<PortableText {components} value={body} />

	<div class="page-footer">
		zuletzt geändert am {new Date(updatedAt).toLocaleString()}
	</div>
</div>

<style lang="scss">
	@import '../styles/vars';

	.event-page {
		h1 {
			// TODO
			// color: white;
			position: relative;

			width: fit-content;
			margin: auto;
			padding: 1rem 2rem;

			margin-bottom: 6rem;

			&::before {
				z-index: -1;
				inset: 0;
				position: absolute;
				content: '';

				border-radius: 999px;
				background-color: white;
				// border: 3px solid $color-accent;
			}
		}

		:global(> *) {
			margin: 2rem 0;
		}

		:global(h1) {
			text-align: center;
		}

		:global(p) {
			margin: 2rem 0;
		}

		:global(img) {
			margin: 2rem 0;
		}
	}

	.page-footer {
		text-align: end;
		font-size: 0.9rem;
		font-style: italic;
		opacity: 0.8;
	}
</style>
