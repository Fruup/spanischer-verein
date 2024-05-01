<script lang="ts">
	import EventCalendar from '$lib/components/eventCalendar/EventCalendar.svelte'
	import type { EventCalendarItem } from '$lib/components/eventCalendar/helpers'
	import { fly } from 'svelte/transition'
	import { elasticIn } from 'svelte/easing'

	export let events: EventCalendarItem[]

	let isOpen = false

	const handleOpen = () => {
		isOpen = !isOpen
	}
</script>

<button type="button" on:click={handleOpen}> OPEN </button>

{#if isOpen}
	<div transition:fly={{ easing: elasticIn, x: 10, y: 10, duration: 200 }} class="container">
		<EventCalendar {events} />
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	button {
		position: fixed;
		right: 0;
		bottom: 0;
	}

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
