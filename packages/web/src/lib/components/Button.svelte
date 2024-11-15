<script lang="ts">
	import Loader from '$lib/components/icons/Loader.svelte'
	import type { Component } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props {
		type?: HTMLButtonAttributes['type']
		icon?: Component | undefined
		size?: 's' | 'm'
		tabindex?: number | undefined
		disabled?: boolean
		href?: string | undefined
		onClick?: (() => any) | undefined
		children?: import('svelte').Snippet
	}

	let {
		type = 'button',
		icon = undefined,
		size = 'm',
		tabindex = undefined,
		disabled: _disabled = false,
		href = undefined,
		onClick = undefined,
		children,
	}: Props = $props()

	let loading = $state(false)
	let showLoader = $state(false)

	let onClickPromise = $derived(async () => await onClick?.())

	let iconOnly = $derived(!!icon && !children)
	let disabled = $derived(_disabled || loading)

	async function handleClick() {
		if (!onClick) return

		loading = true

		let timer: ReturnType<typeof setTimeout>

		onClickPromise().finally(() => {
			showLoader = false
			loading = false
			clearTimeout(timer)
		})

		timer = setTimeout(() => {
			showLoader = true
		}, 250)
	}
</script>

{#if href}
	<a {href} class:iconOnly class="size-{size}" class:disabled>
		{#if showLoader}
			<Loader />
		{:else if icon}
			{@const SvelteComponent = icon}
			<SvelteComponent />
		{/if}

		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{tabindex}
		{disabled}
		class:iconOnly
		class="size-{size}"
		class:disabled
		onclick={handleClick}
	>
		{#if showLoader}
			<Loader />
		{:else if icon}
			{@const SvelteComponent_1 = icon}
			<SvelteComponent_1 />
		{/if}

		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	$color: $color-accent;
	$color-hover: color.adjust($color, $lightness: -10%);

	button,
	a {
		display: block;

		font-size: 1rem;
		background-color: $color;
		color: white;
		border: none;
		padding: 0.75rem 1rem;
		border-radius: var(--border-radius);
		cursor: pointer;

		width: fit-content;

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

			color: white;
		}

		&:hover {
			background-color: $color-hover;
		}

		&.size-s {
			font-size: 0.75rem;
			width: 2rem;
			height: 2rem;
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
