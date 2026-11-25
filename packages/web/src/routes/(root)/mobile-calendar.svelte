<script module lang="ts">
	let open = $state(false)

	/** Shared open state for the drawer that holds the calendar on narrow screens. */
	export const mobileCalendar = {
		get open() {
			return open
		},
		set open(value: boolean) {
			open = value
		},
	}
</script>

<script lang="ts">
	import { afterNavigate } from '$app/navigation'

	import EventCalendar from '#lib/components/event-calendar/event-calendar.svelte'
	import type { EventCalendarItem } from '#lib/components/event-calendar/helpers.js'
	import * as Sheet from '#lib/components/ui/sheet/index.js'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		getEvents: (year: number, month: number) => Promise<EventCalendarItem[]>
	}

	let { getEvents }: Props = $props()

	// Following a marked day leaves the page the sheet is sitting on, so the
	// sheet goes with it. Closing it on the click instead would tear the
	// calendar out from under the router before it had handled the link.
	afterNavigate(() => (mobileCalendar.open = false))
</script>

<Sheet.Root bind:open={mobileCalendar.open}>
	<Sheet.Content
		side="bottom"
		class="max-h-[85vh] gap-0 rounded-t-panel border-edge-subtle bg-background text-base shadow-floating"
	>
		<Sheet.Header class="shrink-0 gap-0.5 border-b border-hairline px-4 pt-4 pb-3">
			<Sheet.Title class="m-0 font-serif text-md leading-none">{t('calendar')}</Sheet.Title>

			<Sheet.Description class="m-0 pr-10 text-xs leading-tight text-ink-muted">
				{t('calendar_tap_hint')}
			</Sheet.Description>
		</Sheet.Header>

		<!--
			Inside the sheet the calendar sits on the sheet's own surface, and it
			takes the full width it is given: a day cell is square, so the wider the
			sheet the bigger the tap target.
		-->
		<div
			class="w-full overflow-y-auto overscroll-contain px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] [&_[data-event-calendar]]:border-0 [&_[data-event-calendar]]:bg-transparent [&_[data-event-calendar]]:p-0 [&_[data-event-calendar]]:shadow-none"
		>
			<EventCalendar {getEvents} swipeable />

			<p class="mt-3 flex items-center justify-center gap-2 text-2xs text-ink-muted">
				<span aria-hidden="true" class="size-3 rounded-sm bg-brand"></span>
				{t('calendar_legend')}
			</p>
		</div>
	</Sheet.Content>
</Sheet.Root>
