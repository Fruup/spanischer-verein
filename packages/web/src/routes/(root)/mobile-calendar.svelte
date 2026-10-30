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
	import EventCalendar from '#lib/components/event-calendar/event-calendar.svelte'
	import type { EventCalendarItem } from '#lib/components/event-calendar/helpers.js'
	import * as Drawer from '#lib/components/ui/drawer/index.js'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		events: EventCalendarItem[]
	}

	let { events }: Props = $props()
</script>

<Drawer.Root bind:open={mobileCalendar.open}>
	<Drawer.Content
		class="items-center rounded-t-panel border-t border-edge-subtle pb-6 shadow-floating"
	>
		<Drawer.Header class="sr-only">
			<Drawer.Title>{t('calendar')}</Drawer.Title>
			<Drawer.Description>{t('event_calendar_label')}</Drawer.Description>
		</Drawer.Header>

		<!-- Inside the drawer the calendar sits on the drawer's own surface. -->
		<div
			class="[&_[data-event-calendar]]:border-0 [&_[data-event-calendar]]:bg-transparent [&_[data-event-calendar]]:shadow-none"
		>
			<EventCalendar {events} />
		</div>
	</Drawer.Content>
</Drawer.Root>
