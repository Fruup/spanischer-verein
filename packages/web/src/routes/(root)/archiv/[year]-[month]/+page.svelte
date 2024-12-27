<script lang="ts">
	import { goto } from '$app/navigation'
	import EventsOverviewPage from '../../EventsOverviewPage.svelte'
	import { onMount } from 'svelte'

	let { data } = $props()

	let year = $derived(data.year)
	let month = $derived(data.month)

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	onMount(() => {
		if (month === currentMonth && year === currentYear) {
			goto('/', { noScroll: true, replaceState: true })
		}
	})
</script>

<EventsOverviewPage events={data.events} pastHighlights={data.pastHighlights} {year} {month} />
