<script lang="ts">
	import type { ComponentType } from 'svelte'

	export let icon: ComponentType | undefined = undefined
	export let size: 's' | 'm' = 'm'
	export let tabindex: number | undefined = undefined

	$: iconOnly = !!icon && !$$slots.default
</script>

<button type="button" {tabindex} class:iconOnly class="size-{size}" on:click>
	{#if icon}
		<svelte:component this={icon} />
	{/if}

	<slot />
</button>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	$color: $color-accent;
	$color-hover: color.adjust($color, $lightness: -10%);

	button {
		font-size: 1rem;
		background-color: $color;
		color: white;
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		cursor: pointer;

		display: flex;
		align-items: center;
		gap: 1ch;

		transition: background-color 200ms ease;

		&.iconOnly {
			width: 2.5rem;
			height: auto;
			aspect-ratio: 1;

			padding: 0;
			border-radius: 999px;
			box-sizing: content-box;
		}

		&:hover {
			background-color: $color-hover;
		}

		&.size-s {
			font-size: 0.75rem;
			width: 2rem;
			height: 2rem;
		}
	}
</style>
