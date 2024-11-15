<script lang="ts">
	import { createBubbler } from 'svelte/legacy'

	const bubble = createBubbler()
	interface Props {
		href?: string | undefined
		children?: import('svelte').Snippet
	}

	let { href = undefined, children }: Props = $props()
</script>

{#if href}
	<a {href} target="_blank" rel="noreferrer nofollow">
		{@render children?.()}
	</a>
{:else}
	<button type="button" onclick={bubble('click')}>
		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	$color: #0070e0;

	a,
	button {
		display: block;

		font-size: 1rem;
		margin: 0;

		text-wrap: nowrap;

		border: 2px solid $color;

		border-radius: var(--border-radius);
		transition: all 250ms ease;
		padding: 0.5em 0.66em;
		padding: calc(0.5em - 2px) 0.5em;

		background-color: white;

		&:hover {
			background-color: color.change($color, $alpha: 0.1);
		}

		cursor: pointer;
	}
</style>
