<script module lang="ts">
	export interface HeroImageSpec {
		url: string
		prominentColor?: string | undefined
		dimensions?: { width: number; height: number } | undefined
	}
</script>

<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte'
	import { DateFormatter } from '@internationalized/date'
	import { locale } from '#lib/locale/state.svelte.ts'

	interface Props {
		title: string
		/** ISO timestamp. Absent on plain pages, which get the title only. */
		time?: string | undefined
		image?: HeroImageSpec | undefined
		/** Rendered as a back link above the hero when given. */
		backHref?: string | undefined
		backLabel?: string
	}

	let {
		title,
		time = undefined,
		image = undefined,
		backHref = undefined,
		backLabel = 'Alle Veranstaltungen',
	}: Props = $props()

	const date = $derived(time ? new Date(time) : undefined)

	// Darkened the same way the overview cards do it, so a poster that does not
	// fill the frame sits on a ground taken from the poster itself.
	const backgroundColor = $derived(
		image?.prominentColor && `oklch(from ${image.prominentColor} calc(l * 0.8) c h)`,
	)

	const dayFormatter = $derived(new DateFormatter(locale.current, { day: 'numeric' }))
	const monthFormatter = $derived(new DateFormatter(locale.current, { month: 'short' }))
	const fullFormatter = $derived(
		new DateFormatter(locale.current, { weekday: 'long', day: 'numeric', month: 'long' }),
	)

	// Day granularity: an event is only "past" once its day is over, which keeps
	// the label from flipping while people are still at the event.
	const isPast = $derived.by(() => {
		if (!date) return false

		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)

		return endOfDay.getTime() < Date.now()
	})
</script>

<header class="mb-8">
	{#if backHref}
		<a
			href={backHref}
			class="group mb-6 inline-flex items-center gap-1.5 rounded text-xs text-ink-muted focus-ring transition-colors hover:text-brand"
		>
			<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-0.5" />
			{backLabel}
		</a>
	{/if}

	{#if image}
		<div
			style:background-color={backgroundColor}
			class="relative mb-8 flex max-h-[32rem] justify-center overflow-hidden rounded-panel shadow-raised"
		>
			<!--
				Posters arrive in whatever shape they were designed in, and a
				portrait one leaves wide bands either side of the column. The same
				image, blown up and blurred, fills them with the poster's own
				colours instead of a flat block.
			-->
			<img
				src={image.url}
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 m-0 size-full scale-110 object-cover opacity-60 blur-2xl select-none"
			/>

			<img
				src={image.url}
				alt="Titelbild der Veranstaltung „{title}“"
				width={image.dimensions?.width}
				height={image.dimensions?.height}
				class="relative m-px max-h-[32rem] w-auto max-w-full object-contain"
			/>

			{#if date}
				<!-- The same date block the overview cards carry, scaled up. -->
				<div
					class="absolute top-3 left-3 flex flex-col items-center gap-0.5 rounded-base bg-background/90 px-3 py-2 shadow-raised backdrop-blur-sm *:leading-none"
				>
					<span class="text-md font-bold tracking-tight">{dayFormatter.format(date)}</span>
					<span class="text-2xs text-ink-muted">{monthFormatter.format(date)}</span>
				</div>
			{/if}

			{#if time}
				<span
					class={[
						'absolute top-3 right-3 rounded-base px-2.5 py-1.5 text-2xs leading-none font-bold tracking-tight shadow-raised backdrop-blur-sm',
						isPast ? 'bg-background/90 text-ink-muted' : 'bg-brand/90 text-brand-contrast',
					]}
				>
					{isPast ? 'Vergangen' : 'Veranstaltung'}
				</span>
			{/if}
		</div>
	{/if}

	{#if date}
		<p class="mb-2 text-2xs font-bold tracking-label text-brand uppercase">
			{fullFormatter.format(date)}
		</p>
	{/if}

	<h1 class="m-0 font-serif text-xl leading-tight font-bold tracking-tight text-balance">
		{title}
	</h1>

	<div class="mt-5 h-[3px] w-14 rounded bg-brand"></div>
</header>
