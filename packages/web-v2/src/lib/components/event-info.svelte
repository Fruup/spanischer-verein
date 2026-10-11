<script module lang="ts">
	export interface EventInfoSpec {
		admission?: string
		time?: string
		location?: string
	}
</script>

<script lang="ts">
	import EventTime from './event-time.svelte'
	import IconCoin from './icons/icon-coin.svelte'
	import IconPin from './icons/icon-pin.svelte'
	import IconTime from './icons/icon-time.svelte'

	interface Props {
		eventInfo: EventInfoSpec
	}

	let { eventInfo }: Props = $props()

	let admission = $derived(eventInfo.admission)
	let eventTime = $derived(eventInfo.time)
	let location = $derived(eventInfo.location)
</script>

{#if admission || eventTime || location}
	<div
		class="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 gap-y-4 text-xs hyphens-auto text-ink-muted"
	>
		{#if eventTime}
			<div class="flex justify-self-end text-[1.5em]">
				<IconTime />
			</div>

			<div class="justify-self-start">
				<EventTime time={eventTime} />
			</div>

			<div></div>
		{/if}

		{#if location}
			<div class="flex justify-self-end text-[1.5em]">
				<IconPin />
			</div>

			<div class="justify-self-start">
				<span>
					{@html location.replaceAll('\n', '<br />')}
				</span>
			</div>

			<div></div>
		{/if}

		{#if admission}
			<div class="flex justify-self-end text-[1.5em]">
				<IconCoin />
			</div>

			<div class="justify-self-start">
				<span>
					{@html admission.replaceAll('\n', '<br />')}
				</span>
			</div>

			<div></div>
		{/if}
	</div>
{/if}
