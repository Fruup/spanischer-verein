<script lang="ts">
	import IconBurger from '../icons/IconBurger.svelte'
	import IconCalendar from '../icons/IconCalendar.svelte'

	export let isCalendarOpen = false
	export let isFlyoutOpen = false

	$: hidden = isCalendarOpen || isFlyoutOpen
</script>

<nav class="mobile-navigation-bar" class:hidden>
	<button
		class="primary"
		on:click={() => (isCalendarOpen = !isCalendarOpen)}
		title="Öffne Kalender"
	>
		<IconCalendar />
	</button>

	<button
		class="secondary"
		on:click={() => (isFlyoutOpen = !isFlyoutOpen)}
		title="Öffne Navigation"
	>
		<IconBurger />
	</button>
</nav>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.mobile-navigation-bar {
		position: fixed;
		bottom: 2rem;
		right: 0;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		border: 2px solid $color-accent;
		border-right: none;
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;

		overflow: clip;

		@include shadow;

		z-index: 1000;

		@include min-md {
			display: none;
		}

		transition: all 200ms ease;

		&.hidden {
			opacity: 0;
			translate: 100%;
		}
	}

	button {
		font-size: 1em;

		border: none;
		background: none;
		width: 2rem;
		height: 2rem;

		&.primary {
			background: $color-accent;
			color: white;
			// color: rgba(255, 255, 255, 0.75);
		}

		&.secondary {
			background: white;
			color: $color-accent;
		}
	}
</style>
