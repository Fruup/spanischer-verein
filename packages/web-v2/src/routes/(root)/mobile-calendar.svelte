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

	interface Props {
		events: EventCalendarItem[]
	}

	let { events }: Props = $props()
</script>

<Drawer.Root bind:open={mobileCalendar.open}>
	<Drawer.Content class="items-center rounded-t-[30px] pb-4 shadow-soft">
		<Drawer.Header class="sr-only">
			<Drawer.Title>Kalender</Drawer.Title>
			<Drawer.Description>Veranstaltungskalender</Drawer.Description>
		</Drawer.Header>

		<!-- Inside the drawer the calendar sits on the drawer's own surface. -->
		<div class="[&_[data-event-calendar]]:bg-transparent [&_[data-event-calendar]]:shadow-none">
			<EventCalendar {events} />
		</div>
	</Drawer.Content>
</Drawer.Root>
