<script lang="ts">
	import IconCoin from './icons/IconCoin.svelte'
	import IconPin from './icons/IconPin.svelte'
	import IconTime from './icons/IconTime.svelte'
	import EventMarker from './EventMarker.svelte'
	import WithShadow from './icons/WithShadow.svelte'

	interface EventInfoSpec {
		admission?: string
		eventTime?: string
		location?: {
			title: string
			address: string
			url?: string
		}
	}

	let { eventInfo } = $props<{ eventInfo: EventInfoSpec }>()

	const admission = $derived(eventInfo.admission)
	const eventTime = $derived(eventInfo.eventTime)
	const location = $derived(eventInfo.location)
</script>

{#if admission || eventTime || location}
	<div class="event-info">
		<EventMarker />

		{#if eventTime}
			<WithShadow>
				<IconTime />
			</WithShadow>

			<span>
				{new Date(eventTime).toLocaleDateString(undefined, {
					dateStyle: 'medium',
				})}
				<br />
				{new Date(eventTime).toLocaleTimeString(undefined, {
					timeStyle: 'short',
				})}
			</span>
		{/if}

		{#if location}
			<WithShadow>
				<IconPin />
			</WithShadow>

			<span>
				{@html location.address.replaceAll('\n', '<br />')}
			</span>
		{/if}

		{#if admission}
			<WithShadow>
				<IconCoin />
			</WithShadow>

			<span>
				{@html admission.replaceAll('\n', '<br />')}
			</span>
		{/if}
	</div>
{/if}

<style lang="scss">
	@import '../styles/vars.scss';

	.event-info {
		position: relative;

		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 12px;
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);

		margin: 4rem auto;
		padding: 2rem;
		hyphens: auto;

		font-size: 1rem;
		color: #555;
		display: grid;
		place-content: center;
		text-align: center;
		grid-auto-flow: column;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr auto 1fr;
		column-gap: 0.5rem;

		:global(.shadow-container) {
			margin-bottom: 0.5rem;
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

		@include max-md {
			width: fit-content;

			display: flex;
			flex-direction: column;

			span:not(:last-of-type) {
				margin-bottom: 2rem;
			}
		}
	}
</style>
