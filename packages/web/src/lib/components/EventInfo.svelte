<script lang="ts">
	import IconCoin from './icons/IconCoin.svelte'
	import IconPin from './icons/IconPin.svelte'
	import IconTime from './icons/IconTime.svelte'
	import EventTime from './EventTime.svelte'

	interface EventInfoSpec {
		admission?: string
		time?: string
		location?: {
			title: string
			address: string
			url?: string
		}
	}

	export let eventInfo: EventInfoSpec

	$: admission = eventInfo.admission
	$: eventTime = eventInfo.time
	$: location = eventInfo.location
</script>

{#if admission || eventTime || location}
	<div class="event-info">
		{#if eventTime}
			<div class="item">
				<IconTime />

				<EventTime time={eventTime} />
			</div>
		{/if}

		{#if location}
			<div class="item">
				<IconPin />

				<span>
					{@html location.address.replaceAll('\n', '<br />')}
				</span>
			</div>
		{/if}

		{#if admission}
			<div class="item">
				<IconCoin />

				<span>
					{@html admission.replaceAll('\n', '<br />')}
				</span>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	.event-info {
		hyphens: auto;

		font-size: 0.8rem;
		color: #555;

		display: flex;
		flex-direction: row;
		gap: 1rem;

		.item {
			flex: 1 0 0;

			text-align: center;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			font-size: 0.9em;
			line-height: 1.5;
			letter-spacing: 0.5px;
		}

		:global(.event-marker) {
			background-color: var(--color-surface-0);
			padding: 0.5rem;
			height: fit-content;
			width: fit-content;

			position: absolute;
			top: 0;
			left: 50%;
			translate: -50% -50%;
		}

		@media screen and (max-width: 600px) {
			width: fit-content;
			margin: auto;

			// flex-direction: column;
			flex-wrap: wrap;

			> * {
				min-width: 100px;
			}

			span:not(:last-of-type) {
				margin-bottom: 2rem;
			}
		}
	}
</style>
