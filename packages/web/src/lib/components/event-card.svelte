<script lang="ts">
	import { getEventUrl } from '#lib/helpers/url.js'
	import { cn } from '#lib/utils.js'

	import EventTime from './event-time.svelte'
	import { MapPinIcon, CalendarIcon, ArrowRightIcon } from '@lucide/svelte'
	import { parseAbsolute, DateFormatter, getLocalTimeZone } from '@internationalized/date'
	import type { ClassValue } from 'svelte/elements'
	import { insertWordBreaks } from '#lib/helpers/insert-word-breaks.ts'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import { t } from '#lib/messages/index.ts'
	import { locale } from '#lib/locale/state.svelte.ts'

	interface Props {
		event: ContentApi.Event
		/** Lay the image beside the content instead of above it. */
		horizontal?: boolean
		/**
		 * Narrow screens get the horizontal layout even when the card is stacked
		 * on desktop: a full-width poster plus the text runs most of a phone
		 * screen, so one card is all that fits.
		 */
		compactOnMobile?: boolean
		class?: ClassValue
		imageClass?: ClassValue
		highlight?: boolean
	}

	let {
		event,
		horizontal,
		compactOnMobile,
		class: className,
		imageClass,
		highlight,
	}: Props = $props()

	const prominentColor = $derived(event.mainImage?.prominentColor)
	const backgroundColor = $derived(
		prominentColor ? `oklch(from ${prominentColor} calc(l * 0.8) c h)` : undefined,
	)

	const shortMonthFormatter = $derived(new DateFormatter(locale.current, { month: 'short' }))

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
		compactOnMobile && 'max-tablet:w-full max-tablet:flex-row max-tablet:items-stretch',
		className,
	]}
>
	<div
		class={[
			'relative',
			horizontal ? 'w-2/5 min-w-28 shrink-0' : 'w-full',
			compactOnMobile && 'max-tablet:w-2/5 max-tablet:min-w-28 max-tablet:shrink-0',
		]}
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

		{#if event.cancelled}
			<div
				class={[
					'absolute top-0 right-2 z-1 rounded-b px-3 py-2 text-sm leading-none font-bold tracking-tight text-background shadow-sm',
					'transition-opacity group-hover:opacity-50',
					'bg-brand text-brand-contrast',
				]}
			>
				{t('cancelled')}!
			</div>
		{:else if highlight}
			<div
				class={[
					'absolute top-0 right-2 z-1 rounded-b px-2 py-1.5 text-2xs leading-none font-bold tracking-tight text-background shadow-sm',
					'transition-opacity group-hover:opacity-50',
					'bg-brand text-brand-contrast',
				]}
			>
				Highlight
			</div>
		{/if}

		{#if event.mainImage?.url}
			<img
				src={event.mainImage?.url}
				alt={t('event_card_image_alt', { title: event.title })}
				style:background-color={backgroundColor}
				class={[
					'm-0 transition-[scale]',
					'group-focus-visible:scale-[1.03]',
					'aspect-4/3 h-auto w-full object-contain',
					compactOnMobile &&
						'max-tablet:absolute max-tablet:inset-0 max-tablet:aspect-auto max-tablet:h-full',
					imageClass,
				]}
			/>
		{:else}
			<!-- Keeps the card's proportions when there is no poster to show. -->
			<div
				class={cn(
					'bg-chip',
					'aspect-4/3 h-auto w-full',
					compactOnMobile &&
						'max-tablet:absolute max-tablet:inset-0 max-tablet:aspect-auto max-tablet:h-full',
				)}
			></div>
		{/if}
	</div>

	<div
		class={[
			'flex min-w-0 grow flex-col',
			horizontal ? 'gap-1 p-4' : 'gap-1.5 p-5',
			compactOnMobile && 'max-tablet:gap-1 max-tablet:p-4',
		]}
	>
		<div
			class={[
				'flex items-center gap-1.5 text-nowrap text-ink/70',
				horizontal ? 'text-sm' : 'text-xs',
				event.cancelled && 'line-through',
			]}
		>
			<CalendarIcon class="size-[1.1em]" />
			<EventTime time={event.eventTime} />
		</div>

		<h4
			class={[
				'w-fit font-serif leading-tight font-semibold tracking-tight text-balance hyphens-auto group-hover:text-brand group-focus:text-brand',
				// horizontal ? 'line-clamp-3' : '',
				horizontal ? 'text-lg' : 'text-md',
				compactOnMobile && 'max-tablet:line-clamp-4 max-tablet:text-sm',
			]}
		>
			<!-- TODO: escape HTML -->
			{@html insertWordBreaks(event.title)}
		</h4>

		{#if event.description}
			<div
				class={[
					'text-xs leading-snug hyphens-auto text-ink/70',
					compactOnMobile && 'max-tablet:line-clamp-3',
				]}
			>
				{@html event.description}
			</div>
		{/if}

		<div
			class={[
				'flex items-center gap-1.5 text-nowrap text-ink/70',
				horizontal ? 'text-sm' : 'text-xs',
			]}
		>
			<MapPinIcon class="size-[1.1em]" />
			Centro Machado
		</div>

		<div class={['flex grow items-end', horizontal && 'pt-1']}>
			<div
				class={[
					'flex items-center gap-1.5 text-nowrap text-brand group-hover:underline',
					horizontal ? 'text-sm' : 'text-xs',
				]}
			>
				<span>{t('learn_more')}</span>
				<ArrowRightIcon class="size-4" />
			</div>
		</div>
	</div>
</a>
