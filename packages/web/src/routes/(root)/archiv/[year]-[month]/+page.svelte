<script lang="ts">
	import { run } from 'svelte/legacy';

	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import EventsOverviewPage from '../../EventsOverviewPage.svelte'

	let { data } = $props();

	let year = $derived(data.year)
	let month = $derived(data.month)

	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	run(() => {
		if (browser && month === currentMonth && year === currentYear) {
			goto('/', { noScroll: true, replaceState: true })
		}
	});
</script>

<EventsOverviewPage events={data.events} pastHighlights={data.pastHighlights} {year} {month} />
