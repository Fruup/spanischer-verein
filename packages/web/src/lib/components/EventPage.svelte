<script lang="ts">
	import type { EventSchema } from '@spanischer-verein/sanity/schemas/event'
	import { fly } from 'svelte/transition'
	import EventInfo from './EventInfo.svelte'
	import BlockContent from './blockContent/BlockContent.svelte'

	export let event: EventSchema

	$: body = event.body
	$: eventInfo = {
		admission: event.eventAdmission,
		time: event.eventTime,
		location: event.eventLocation
			? {
					title: event.eventLocation,
					address: event.eventLocation,
				}
			: undefined,
	}
	$: title = event.title
</script>

<div class="event-page" in:fly={{ y: 10 }}>
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

	.event-page {
		h2 {
			@include font-serif;
			font-weight: normal;
			font-size: 1.75rem;

			text-align: center;

			position: relative;

			width: fit-content;
			margin: auto;
			// padding: 1rem 2rem;

			margin-bottom: 2rem;
		}
	}
</style>
