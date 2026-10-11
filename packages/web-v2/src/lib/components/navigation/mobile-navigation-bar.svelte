<script lang="ts">
	import { cn } from '#lib/utils.js'

	import IconBurger from '../icons/icon-burger.svelte'
	import IconCalendar from '../icons/icon-calendar.svelte'

	interface Props {
		isCalendarOpen?: boolean
		isFlyoutOpen?: boolean
	}

	let { isCalendarOpen = $bindable(false), isFlyoutOpen = $bindable(false) }: Props = $props()

	let hidden = $derived(isCalendarOpen || isFlyoutOpen)
</script>

<nav
	class={cn(
		'fixed right-0 bottom-8 z-[1000] flex flex-col justify-between overflow-clip rounded-l-lg border-2 border-r-0 border-brand shadow-soft transition-all duration-200 ease-[ease] desktop:hidden',
		hidden && 'translate-x-full opacity-0',
	)}
>
	<button
		class="size-8 border-none bg-brand text-base text-white"
		onclick={() => (isCalendarOpen = !isCalendarOpen)}
		title="Öffne Kalender"
	>
		<IconCalendar />
	</button>

	<button
		class="size-8 border-none bg-white text-base text-brand"
		onclick={() => (isFlyoutOpen = !isFlyoutOpen)}
		title="Öffne Navigation"
	>
		<IconBurger />
	</button>
</nav>
