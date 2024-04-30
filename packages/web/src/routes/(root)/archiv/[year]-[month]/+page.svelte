<script lang="ts">
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import EventsOverviewPage from '../../EventsOverviewPage.svelte'

	export let data

	$: year = data.year
	$: month = data.month

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	$: if (browser && month === currentMonth && year === currentYear) {
		goto('/', { noScroll: true, replaceState: true })
	}
</script>

<EventsOverviewPage events={data.events} pastHighlights={data.pastHighlights} {year} {month} />
