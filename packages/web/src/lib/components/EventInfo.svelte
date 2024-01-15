<script lang="ts">
	import IconCoin from './icons/IconCoin.svelte'
	import IconPin from './icons/IconPin.svelte'
	import IconTime from './icons/IconTime.svelte'
	import EventMarker from './EventMarker.svelte'

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
	<EventMarker />

	<div class="event-info">
		{#if eventTime}
			<div>
				<IconTime />
				{new Date(eventTime).toLocaleDateString(undefined, {
					dateStyle: 'medium',
				})}
				<br />
				{new Date(eventTime).toLocaleTimeString(undefined, {
					timeStyle: 'short',
				})}
			</div>
		{/if}

		{#if location}
			<div>
				<IconPin />
				{@html location.address.replaceAll('\n', '<br />')}
			</div>
		{/if}

		{#if admission}
			<div>
				<IconCoin />
				{@html admission.replaceAll('\n', '<br />')}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.event-info {
		// border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 12px;

		padding: 2rem;

		font-size: 1rem;
		color: #666;
		display: grid;
		gap: 1.5rem;
		place-content: center;
		text-align: center;
		// grid-template-columns: repeat(3, 1fr);
		grid-auto-flow: column;
	}
</style>
