<script lang="ts">
	import IconBurger from '../icons/IconBurger.svelte'
	import IconCalendar from '../icons/IconCalendar.svelte'
	import IconClose from '../icons/IconClose.svelte'

	export let isCalendarOpen = false
	export let isFlyoutOpen = false
</script>

<nav class="mobile-navigation-bar">
	<button class="primary" on:click={() => (isCalendarOpen = !isCalendarOpen)}>
		<div class="icon-container">
			<IconCalendar />

			{#if isCalendarOpen}
				<!-- <span class="icon-close"><IconClose /></span> -->
			{/if}
		</div>
	</button>

	<button class="secondary" on:click={() => (isFlyoutOpen = !isFlyoutOpen)}>
		<div class="icon-container">
			<IconBurger />

			{#if isFlyoutOpen}
				<!-- <span class="icon-close"><IconClose /></span> -->
			{/if}
		</div>
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

	.icon-container {
		position: relative;
		display: flex;
	}

	.icon-close {
		height: fit-content;

		position: absolute;
		top: 0;
		right: 0;
		// font-size: 12px;
		translate: 50% -50%;
		color: white;
		// opacity: 0;
		// transition: opacity 0.2s;
	}
</style>
