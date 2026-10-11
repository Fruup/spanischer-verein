<script lang="ts">
	import { navigating } from '$app/state'

	import Note from '#lib/components/Note.svelte'
	import Loader from '#lib/components/icons/Loader.svelte'

	import EventsOverview from './EventsOverview.svelte'
	import { mobileCalendar } from './MobileCalendar.svelte'

	interface Props {
		events: any[]
		pastHighlights: any[]
		year: number
		month: number
	}

	let { events, pastHighlights, year, month }: Props = $props()

	let isPast = $derived(new Date().getTime() > new Date(year, month).getTime())

	// Grace time for events to be considered past
	const graceTime = 1000 * 60 * 60 * 6 // 6 hours

	let eventsAfterNow = $derived(
		events.filter(
			(event) => new Date(event.eventTime).getTime() + graceTime >= new Date().getTime(),
		),
	)

	let futureEvents = $derived(isPast ? events : eventsAfterNow)

	let monthString = $derived(
		new Date(year, month - 1).toLocaleString(undefined, {
			month: 'long',
			year: 'numeric',
		}),
	)

	function jumpToCalendar() {
		if (window.matchMedia('(max-width: 768px)').matches) {
			mobileCalendar.open = true
		} else {
			document.querySelector('#calendar')?.scrollIntoView({ behavior: 'smooth' })
		}
	}
</script>

<h3 class="m-0 flex items-center justify-between max-desktop:flex-col max-desktop:gap-2 [&>*]:mt-0">
	<span class="heading-2 max-desktop:mb-0 max-desktop:self-start">Veranstaltungen</span>
	<span class="heading-3 max-desktop:self-end">{monthString}</span>
</h3>

{#if !futureEvents.length}
	<Note>
		In dieser Zeit {isPast ? 'waren' : 'sind'}<br />
		keine Veranstaltungen geplant...
	</Note>
{/if}

{#await navigating.complete}
	<div class="flex min-h-[50vh] items-center justify-center [&_svg]:size-20">
		<Loader />
	</div>
{:then}
	<EventsOverview events={futureEvents} />

	{#if pastHighlights.length > 0}
		<div class="mt-16 mb-8 flex justify-end [&>*]:m-0">
			<h3 class="heading-3">Vergangene Highlights</h3>
		</div>

		<EventsOverview events={pastHighlights} />

		<Note>
			Um weitere vergangene Events zu entdecken,<br />
			nutze unseren
			<button
				type="button"
				class="m-0 inline cursor-pointer border-none bg-transparent p-0 text-[1em] text-inherit underline decoration-brand hover:text-brand focus:text-brand"
				onclick={jumpToCalendar}
			>
				Kalender
			</button>.
		</Note>
	{/if}
{/await}
