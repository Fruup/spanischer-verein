<script lang="ts">
	import { cn } from '#lib/utils.js'
	import { t } from '#lib/messages/index.ts'
	import { CalendarIcon, MenuIcon } from '@lucide/svelte'

	interface Props {
		isCalendarOpen?: boolean
		isFlyoutOpen?: boolean
	}

	let { isCalendarOpen = $bindable(false), isFlyoutOpen = $bindable(false) }: Props = $props()

	let hidden = $derived(isCalendarOpen || isFlyoutOpen)
</script>

<!--
	The only navigation on narrow screens — the header drops its menu button at
	the same width — so it sits above the home indicator rather than on it, and
	both targets are a full 48px.
-->
<nav
	aria-label={t('navigation_label')}
	class={cn(
		'fixed right-0 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-[1000] flex flex-col justify-between overflow-clip rounded-l-panel border border-r-0 border-edge-subtle shadow-floating transition-[translate,opacity] desktop:hidden',
		hidden && 'pointer-events-none translate-x-full opacity-0',
	)}
>
	<button
		class="size-12 border-none bg-brand text-base text-brand-contrast focus-ring transition-colors hover:bg-brand-hover"
		aria-expanded={isCalendarOpen}
		onclick={() => (isCalendarOpen = !isCalendarOpen)}
		title={t('open_calendar')}
	>
		<CalendarIcon class="size-4" />
	</button>

	<button
		class="size-12 border-none bg-surface-raised text-base text-brand-link focus-ring transition-colors hover:bg-surface-1"
		aria-expanded={isFlyoutOpen}
		onclick={() => (isFlyoutOpen = !isFlyoutOpen)}
		title={t('open_navigation')}
	>
		<MenuIcon class="size-4" />
	</button>
</nav>
