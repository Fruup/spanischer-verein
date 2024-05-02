<script context="module" lang="ts">
	export interface EventInfoSpec {
		admission?: string
		time?: string
		location?: string
	}
</script>

<script lang="ts">
	import IconCoin from './icons/IconCoin.svelte'
	import IconPin from './icons/IconPin.svelte'
	import IconTime from './icons/IconTime.svelte'
	import EventTime from './EventTime.svelte'

	export let eventInfo: EventInfoSpec

	$: admission = eventInfo.admission
	$: eventTime = eventInfo.time
	$: location = eventInfo.location
</script>

{#if admission || eventTime || location}
	<div class="event-info">
		{#if eventTime}
			<div class="icon">
				<IconTime />
			</div>

			<div class="content">
				<EventTime time={eventTime} />
			</div>

			<div class="dummy" />
		{/if}

		{#if location}
			<div class="icon">
				<IconPin />
			</div>

			<div class="content">
				<span>
					{@html location.replaceAll('\n', '<br />')}
				</span>
			</div>

			<div class="dummy" />
		{/if}

		{#if admission}
			<div class="icon">
				<IconCoin />
			</div>

			<div class="content">
				<span>
					{@html admission.replaceAll('\n', '<br />')}
				</span>
			</div>

			<div class="dummy" />
		{/if}
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	.event-info {
		hyphens: auto;

		font-size: 0.8rem;
		color: var(--color-text-1);

		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 0.5rem;
		row-gap: 1rem;

		margin-bottom: 2rem;

		align-items: center;

		.icon {
			justify-self: end;
			display: flex;
			font-size: 1.5em;
		}

		.content {
			justify-self: start;
		}
	}
</style>
