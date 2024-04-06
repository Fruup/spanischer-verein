<script lang="ts">
	import type { EventCalendarItem } from '$lib/components/eventCalendar/helpers'

	export let events: EventCalendarItem[]

	// Group by months.
	$: groupedEvents = events.reduce<Record<string, EventCalendarItem[]>>((acc, event) => {
		const label = event.date.toLocaleString(undefined, { month: 'short', year: 'numeric' })

		return {
			...acc,
			[label]: [...(acc[label] ?? []), event],
		}
	}, {})
</script>

<nav title="Event archive navigation">
	<ul>
		{#each Object.entries(groupedEvents) as [month, events]}
			<li>
				{month}

				<ul>
					{#each events as event}
						<li>
							<a href={event.url}>{event.name}</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</nav>
