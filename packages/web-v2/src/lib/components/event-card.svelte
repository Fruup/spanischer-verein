<script lang="ts">
	import { fitParent } from '#lib/helpers/fitParent.js'
	import { getEventUrl } from '#lib/helpers/url.js'
	import { cn } from '#lib/utils.js'

	import EventTime from './event-time.svelte'
	import { MapPinIcon, CalendarIcon, ArrowRightIcon } from '@lucide/svelte'
	import { parseAbsolute, DateFormatter, getLocalTimeZone } from '@internationalized/date'
	import type { ClassValue } from 'svelte/elements'

	interface Props {
		event: {
			title: string
			slug: string
			imageUrl: string
			eventTime: string
			mainImageMeta: {
				prominentColor: string
				dimensions: {
					width: number
					height: number
				}
			}
		}
		/** Lay the image beside the content instead of above it. */
		horizontal?: boolean
		class?: ClassValue
	}

	let { event, horizontal = false, class: className }: Props = $props()

	const backgroundColor = $derived(
		`oklch(from ${event.mainImageMeta.prominentColor} calc(l * 0.8) c h)`,
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
		horizontal ? 'flex-row items-stretch' : 'flex-col',
		className,
	]}
>
	<div
		class={['relative', horizontal ? 'aspect-square h-auto min-w-40' : 'w-full']}
		style:--aspect={event.mainImageMeta.dimensions.width / event.mainImageMeta.dimensions.height}
	>
		<div
			class={cn(
				'absolute top-0 left-0 z-1 flex flex-col items-center gap-0.5 rounded-xl bg-background shadow-sm *:leading-none',
				'm-4 p-2 px-4',
			)}
		>
			<span class="text-sm font-bold">{date.day}</span>
			<span class="text-xs text-ink/70">{monthShort}</span>
		</div>

		{#if !horizontal}
			<div
				class="absolute top-0 right-0 z-1 m-4 rounded-full bg-foreground px-2 py-1.5 text-2xs leading-none font-bold tracking-tight text-background shadow-sm"
			>
				Veranstaltung
			</div>
		{/if}

		<img
			src={event.imageUrl}
			alt="Title image for an event called '{event.title}'"
			style:background-color={backgroundColor}
			class={cn(
				'm-0 transition-[scale]',
				'group-focus-visible:scale-[1.03]',
				horizontal
					? 'absolute inset-0 size-full object-cover'
					: 'aspect-4/3 h-auto w-full object-contain',
			)}
		/>
	</div>

	<div class={cn('flex min-w-0 grow flex-col', horizontal ? 'gap-1.5 p-3' : 'gap-2 p-5')}>
		<div class="flex items-center gap-1.5 text-xs text-nowrap text-ink/70">
			<CalendarIcon class="size-4" />
			<EventTime time={event.eventTime} />
		</div>

		<!-- use:fitParent={{ strategy: 'fontSize' }} -->
		<h4
			class="m-0 w-fit font-serif text-md leading-tight font-semibold tracking-tight text-balance"
		>
			{event.title}
		</h4>

		<div class="flex items-center gap-1.5 text-xs text-nowrap text-ink/70">
			<MapPinIcon class="size-4" />
			Centro Machado
		</div>

		<div class="flex grow items-end">
			<div class="flex items-center gap-1.5 text-xs text-nowrap text-brand group-hover:underline">
				<span>Mehr erfahren</span>
				<ArrowRightIcon class="size-4" />
			</div>
		</div>
	</div>
</a>
