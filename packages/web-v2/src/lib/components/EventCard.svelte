<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'

	import { fitParent } from '#lib/helpers/fitParent.js'
	import { getEventUrl } from '#lib/helpers/url.js'
	import { cn } from '#lib/utils.js'

	import EventTime from './EventTime.svelte'
	import IconCalendar from './icons/IconCalendar.svelte'

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
	in:fly|global={{ y: 30, delay: introDelay }}
	{href}
	class={cn(
		'group grid min-h-full rounded-base border border-black/10 text-center text-base shadow-soft transition-[scale] duration-300 ease-[ease]',
		'grid-rows-[auto_auto]',
		horizontal && 'grid-cols-[auto_auto]',
		'hover:scale-[1.01] hover:outline-2 hover:outline-brand focus:scale-[1.01] focus:outline-2 focus:outline-brand',
		hover && 'scale-[1.01] outline-2 outline-brand',
	)}
>
	<img
		src={event.imageUrl}
		alt="Title image for an event called '{event.title}'"
		style:background-color={backgroundColor}
		class={cn(
			'm-0 h-auto max-h-none min-h-[50%] w-full rounded-base object-cover transition-all duration-300 ease-[ease]',
			'group-hover:scale-105 group-hover:-rotate-[0.5deg] group-hover:shadow-strong',
			'group-focus:scale-105 group-focus:-rotate-[0.5deg] group-focus:shadow-strong',
			reverse && 'order-1',
			hover && 'scale-105 -rotate-[0.5deg] shadow-strong',
		)}
	/>

	<div class="m-6 flex flex-grow flex-col items-center justify-center gap-4">
		<div
			class="m-0 flex items-center justify-center gap-[1ch] rounded-full bg-brand-translucent px-[0.5em] py-[0.15em] text-[0.8em] tracking-[1px] [&_*]:text-white"
		>
			<IconCalendar />
			<EventTime time={event.eventTime} />
		</div>

		<h4
			use:fitParent={{ strategy: 'fontSize' }}
			class="m-0 w-fit font-serif text-[1.35em] tracking-[1px] text-balance"
		>
			{event.title}
		</h4>
	</div>
</a>
