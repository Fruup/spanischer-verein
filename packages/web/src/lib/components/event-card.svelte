<script lang="ts">
	import { fitParent } from '#lib/helpers/fitParent.js'
	import { getEventUrl } from '#lib/helpers/url.js'
	import { cn } from '#lib/utils.js'

	import EventTime from './event-time.svelte'
	import { MapPinIcon, CalendarIcon, ArrowRightIcon } from '@lucide/svelte'
	import { parseAbsolute, DateFormatter, getLocalTimeZone } from '@internationalized/date'
	import type { ClassValue } from 'svelte/elements'
	import { insertWordBreaks } from '#lib/helpers/insert-word-breaks.ts'

	interface Props {
		event: {
			title: string
			slug: string
			/** Absent on events saved without a poster. */
			imageUrl?: string
			eventTime: string
			mainImageMeta: {
				prominentColor: string | null
				dimensions: {
					width: number
					height: number
				} | null
			}
		}
		/** Lay the image beside the content instead of above it. */
		horizontal?: boolean
		class?: ClassValue
		imageClass?: ClassValue
	}

	let { event, horizontal = false, class: className, imageClass }: Props = $props()

	// An event can be published without a poster — the overview reaches back far
	// enough for that to be common — so every image-derived value falls back
	// instead of assuming the metadata is there.
	const dimensions = $derived(event.mainImageMeta?.dimensions)
	const aspectRatio = $derived(dimensions ? dimensions.width / dimensions.height : 4 / 3)

	const prominentColor = $derived(event.mainImageMeta?.prominentColor)
	const backgroundColor = $derived(
		prominentColor ? `oklch(from ${prominentColor} calc(l * 0.8) c h)` : undefined,
	)

	const shortMonthFormatter = new DateFormatter(navigator.language, { month: 'short' })

	const date = $derived(parseAbsolute(event.eventTime, getLocalTimeZone()))
	const jsDate = $derived(new Date(event.eventTime))
	const monthShort = $derived(shortMonthFormatter.format(jsDate))

	const href = $derived(getEventUrl(event.slug))
</script>

<a
	{href}
	class={[
		'group relative flex min-h-full overflow-hidden rounded-base border border-edge-subtle bg-background text-base shadow-raised focus-ring transition-[scale,box-shadow,border-color]',
		'hover:border-brand/60 hover:shadow-lifted',
		'focus-visible:border-brand/60 focus-visible:shadow-lifted',
		horizontal ? 'w-full flex-row items-stretch' : 'flex-col',
		className,
	]}
>
	<div
		class={['relative', horizontal ? 'w-2/5 max-w-48 min-w-28 shrink-0' : 'w-full']}
		style:--aspect={aspectRatio}
	>
		<div
			class={[
				'absolute top-0 left-0 z-1 flex flex-col items-center gap-0.5 rounded bg-background shadow-sm *:leading-none',
				'm-2 px-2 py-1.5',
				'transition-opacity group-hover:opacity-50',
			]}
		>
			<span class="font-bold">{date.day}</span>
			<span class="text-xs text-ink/70">{monthShort}</span>
		</div>

		{#if !horizontal}
			<div
				class={[
					'absolute top-0 right-2 z-1 rounded-b bg-foreground px-2 py-1.5 text-2xs leading-none font-bold tracking-tight text-background shadow-sm',
					'transition-opacity group-hover:opacity-50',
				]}
			>
				Veranstaltung
			</div>
		{/if}

		{#if event.imageUrl}
			<img
				src={event.imageUrl}
				alt="Title image for an event called '{event.title}'"
				style:background-color={backgroundColor}
				class={[
					'm-0 transition-[scale]',
					'group-focus-visible:scale-[1.03]',
					horizontal
						? 'absolute inset-0 size-full object-cover'
						: 'aspect-4/3 h-auto w-full object-contain',
					imageClass,
				]}
			/>
		{:else}
			<!-- Keeps the card's proportions when there is no poster to show. -->
			<div
				class={cn(
					'bg-chip',
					horizontal ? 'absolute inset-0 size-full' : 'aspect-4/3 h-auto w-full',
				)}
			></div>
		{/if}
	</div>

	<div class={['flex min-w-0 grow flex-col', horizontal ? 'gap-1 p-4' : 'gap-1.5 p-5']}>
		<div class="flex items-center gap-1.5 text-xs text-nowrap text-ink/70">
			<CalendarIcon class="size-4" />
			<EventTime time={event.eventTime} />
		</div>

		<h4
			class={[
				'w-fit font-serif leading-tight font-semibold tracking-tight text-balance group-hover:text-brand group-focus:text-brand',
				horizontal ? 'line-clamp-3 text-sm' : 'text-md',
			]}
		>
			<!-- TODO: escape HTML -->
			<!-- TODO: limit to 60 characters -->
			{@html insertWordBreaks(event.title)}
		</h4>

		{#if !horizontal}
			<!-- TODO: description -->
			<!-- <div class="text-xs leading-snug tracking-tight text-ink/70">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit
			</div> -->
		{/if}

		<div class="flex items-center gap-1.5 text-xs text-nowrap text-ink/70">
			<MapPinIcon class="size-4" />
			Centro Machado
		</div>

		<div class={['flex grow items-end', horizontal && 'pt-1']}>
			<div class="flex items-center gap-1.5 text-xs text-nowrap text-brand group-hover:underline">
				<span>Mehr erfahren</span>
				<ArrowRightIcon class="size-4" />
			</div>
		</div>
	</div>
</a>
