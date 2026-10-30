<script module lang="ts">
	export interface EventInfoSpec {
		admission?: string
		time?: string
		location?: string
	}
</script>

<script lang="ts">
	import { CalendarClockIcon, MapPinIcon, TicketIcon } from '@lucide/svelte'
	import { DateFormatter } from '@internationalized/date'
	import type { Component, Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import { locale } from '#lib/locale/state.svelte.ts'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		eventInfo: EventInfoSpec
		class?: ClassValue
	}

	let { eventInfo, class: className }: Props = $props()

	let admission = $derived(eventInfo.admission)
	let eventTime = $derived(eventInfo.time)
	let location = $derived(eventInfo.location)

	const dateFormatter = $derived(
		new DateFormatter(locale.current, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}),
	)
	// `hourCycle` pins this to 24-hour time: the page is German throughout, and
	// a 12-hour clock reads wrong next to the "Uhr" that follows it.
	const timeFormatter = $derived(
		new DateFormatter(locale.current, { timeStyle: 'short', hourCycle: 'h23' }),
	)

	const date = $derived(eventTime ? new Date(eventTime) : undefined)
	const timeSuffix = $derived(t('time_suffix'))
</script>

<!--
	The three facts a visitor needs before deciding to come. They used to sit in
	a bare icon/value grid; grouping them into one labelled card keeps them
	readable next to the hero and lets the block-content version stand alone.
-->
{#snippet row(Icon: Component<{ class?: string }>, label: string, value: Snippet)}
	<div class="flex items-start gap-3 p-4">
		<span
			class="mt-0.5 grid size-9 shrink-0 place-content-center rounded-full bg-brand/10 text-brand"
		>
			<Icon class="size-4.5" />
		</span>

		<div class="min-w-0">
			<dt class="mb-1 text-2xs leading-none font-bold tracking-label text-ink-muted uppercase">
				{label}
			</dt>

			<dd class="m-0 text-sm leading-snug hyphens-auto">
				{@render value()}
			</dd>
		</div>
	</div>
{/snippet}

{#if admission || eventTime || location}
	<dl
		class={[
			'my-8 divide-y divide-hairline overflow-hidden rounded-base border border-edge-subtle bg-surface-raised shadow-raised',
			className,
		]}
	>
		{#if date}
			{@render row(CalendarClockIcon, t('date_label'), dateValue)}
		{/if}

		{#if location}
			{@render row(MapPinIcon, t('location_label'), locationValue)}
		{/if}

		{#if admission}
			{@render row(TicketIcon, t('admission_label'), admissionValue)}
		{/if}
	</dl>
{/if}

{#snippet dateValue()}
	{#if date}
		<time datetime={date.toISOString()}>
			{dateFormatter.format(date)} · {timeFormatter.format(date)}{timeSuffix ? ` ${timeSuffix}` : ''}
		</time>
	{/if}
{/snippet}

{#snippet locationValue()}
	{@html (location ?? '').replaceAll('\n', '<br />')}
{/snippet}

{#snippet admissionValue()}
	{@html (admission ?? '').replaceAll('\n', '<br />')}
{/snippet}
