<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'

	import { fitParent } from '#lib/helpers/fitParent.js'
	import { duration, motion } from '#lib/helpers/motion.js'
	import { getEventUrl } from '#lib/helpers/url.js'
	import { cn } from '#lib/utils.js'

	import EventTime from './event-time.svelte'
	import IconCalendar from './icons/icon-calendar.svelte'

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
		introDelay: number
		horizontal?: boolean
		reverse?: boolean
	}

	let { event, introDelay, horizontal, reverse }: Props = $props()

	let backgroundColor = $derived(event.mainImageMeta.prominentColor)

	let href = $derived(getEventUrl(event.slug))
	let hover = $state(false)

	// Any other link pointing at this event (the calendar, for instance) lights
	// the card up as well.
	onMount(() => {
		const anchors = document.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`)

		const on = () => (hover = true)
		const off = () => (hover = false)

		anchors.forEach((anchor) => {
			anchor.addEventListener('focus', on)
			anchor.addEventListener('blur', off)
			anchor.addEventListener('mouseover', on)
			anchor.addEventListener('mouseleave', off)
		})

		return () => {
			anchors.forEach((anchor) => {
				anchor.removeEventListener('focus', on)
				anchor.removeEventListener('blur', off)
				anchor.removeEventListener('mouseover', on)
				anchor.removeEventListener('mouseleave', off)
			})
		}
	})
</script>

<a
	in:fly|global={{ y: 24, delay: introDelay, duration: motion(duration.slow) }}
	{href}
	class={cn(
		'group grid min-h-full overflow-hidden rounded-base border border-edge-subtle text-center text-base shadow-raised focus-ring transition-[scale,box-shadow,border-color]',
		'grid-rows-[auto_auto]',
		horizontal && 'grid-cols-[auto_auto]',
		'hover:scale-[1.005] hover:border-brand/60 hover:shadow-lifted',
		'focus-visible:border-brand/60 focus-visible:shadow-lifted',
		hover && 'scale-[1.005] border-brand/60 shadow-lifted',
	)}
>
	<img
		src={event.imageUrl}
		alt="Title image for an event called '{event.title}'"
		style:background-color={backgroundColor}
		class={cn(
			'm-0 h-auto max-h-none min-h-[50%] w-full object-cover transition-[scale]',
			'group-hover:scale-[1.03] group-focus-visible:scale-[1.03]',
			reverse && 'order-1',
			hover && 'scale-[1.03]',
		)}
	/>

	<div class="m-6 flex flex-grow flex-col items-center justify-center gap-4">
		<div
			class="m-0 flex items-center justify-center gap-[1ch] rounded-full bg-brand-translucent px-[0.7em] py-[0.2em] text-xs tracking-label [&_*]:text-brand-contrast"
		>
			<IconCalendar />
			<EventTime time={event.eventTime} />
		</div>

		<h4
			use:fitParent={{ strategy: 'fontSize' }}
			class="m-0 w-fit font-serif text-lg tracking-tight text-balance"
		>
			{event.title}
		</h4>
	</div>
</a>
