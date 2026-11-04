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
	import { XIcon } from '@lucide/svelte'

	import { afterNavigate } from '$app/navigation'

	import EventCalendar from '#lib/components/event-calendar/event-calendar.svelte'
	import type { EventCalendarItem } from '#lib/components/event-calendar/helpers.js'
	import * as Drawer from '#lib/components/ui/drawer/index.js'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		getEvents: (year: number, month: number) => Promise<EventCalendarItem[]>
	}

	let { getEvents }: Props = $props()

	// Following a marked day leaves the page the drawer is sitting on, so the
	// drawer goes with it. Closing it on the click instead would tear the
	// calendar out from under the router before it had handled the link.
	afterNavigate(() => (mobileCalendar.open = false))
</script>

<Drawer.Root bind:open={mobileCalendar.open}>
	<Drawer.Content class="max-h-[85vh] rounded-t-panel border-t border-edge-subtle shadow-floating">
		<Drawer.Header
			class="flex shrink-0 flex-row items-start justify-between gap-4 border-b border-hairline px-4 pt-3 pb-3"
		>
			<div class="flex flex-col gap-0.5 text-left">
				<Drawer.Title class="m-0 font-serif text-md leading-none">{t('calendar')}</Drawer.Title>

				<Drawer.Description class="m-0 text-xs leading-tight text-ink-muted">
					{t('calendar_tap_hint')}
				</Drawer.Description>
			</div>

			<Drawer.Close
				aria-label={t('close')}
				class="grid size-10 shrink-0 cursor-pointer place-content-center rounded-full text-ink-muted focus-ring transition-colors hover:bg-surface-1"
			>
				<XIcon class="size-5" />
			</Drawer.Close>
		</Drawer.Header>

		<!--
			Inside the drawer the calendar sits on the drawer's own surface, and it
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
	</Drawer.Content>
</Drawer.Root>
