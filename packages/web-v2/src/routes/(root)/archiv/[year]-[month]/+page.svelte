<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { onMount } from 'svelte'

	import { parseMonthFromUrl } from '#lib/helpers/url.js'
	import { getEventsOverview, getPastHighlights } from '#lib/sanity/sanity.remote.js'

	import EventsOverviewPage from '../../EventsOverviewPage.svelte'

	let { year, month } = $derived(parseMonthFromUrl(page.params))

	let events = $derived(await getEventsOverview({ year, month }))
	const pastHighlights = await getPastHighlights()

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	onMount(() => {
		if (month === currentMonth && year === currentYear) {
			goto('/', { reset: false, replace: true })
		}
	})
</script>

<EventsOverviewPage {events} {pastHighlights} {year} {month} />
