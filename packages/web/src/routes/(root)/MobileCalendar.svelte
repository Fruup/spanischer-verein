<script lang="ts">
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import type { EventCalendarItem } from '$lib/components/eventCalendar/helpers'
	import { fly } from 'svelte/transition'

	export let open = false
	export let events: EventCalendarItem[]
</script>

{#if open}
	<div transition:fly={{ x: 10, y: 10, duration: 500 }} class="container">
		<EventCalendar {events} />
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	.container {
		// padding: 1rem;
		border-radius: 24px;
		z-index: 1000000;
		position: fixed;
		bottom: 0;
		right: 0;
		margin: 1rem;

		// background-color: white;
		@include shadow;
	}
</style>
