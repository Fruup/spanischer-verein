<script lang="ts">
	import { goto } from '$app/navigation'
	import EventsOverview2 from '../../EventsOverview2.svelte'

	export let data

	$: events = data.events
	$: year = data.year
	$: month = data.month

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	$: if (month === currentMonth && year === currentYear) {
		goto('/', { noScroll: true, replaceState: true })
	}
</script>

<EventsOverview2 {events} {year} {month} />
