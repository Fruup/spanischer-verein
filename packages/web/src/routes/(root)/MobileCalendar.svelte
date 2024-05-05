<script context="module">
	import { writable } from 'svelte/store'

	export const isMobileCalendarOpen = writable(false)
</script>

<script lang="ts">
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import type { EventCalendarItem } from '$lib/components/eventCalendar/helpers'
	import Drawer from '$lib/components/ui/Drawer.svelte'

	export let events: EventCalendarItem[]
</script>

<Drawer bind:open={$isMobileCalendarOpen}>
	<div class="mobile-calendar-container">
		<EventCalendar {events} />
	</div>
</Drawer>

<style lang="scss">
	@import 'vars';

	.mobile-calendar-container :global(.calendar) {
		background-color: none !important;
		background: none !important;
		box-shadow: none !important;
	}
</style>
