<script lang="ts">
	import type { ComponentType } from 'svelte'
	import Loader2 from '$lib/components/icons/Loader2.svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	export let type: HTMLButtonAttributes['type'] = 'button'
	export let icon: ComponentType | undefined = undefined
	export let size: 's' | 'm' = 'm'
	export let tabindex: number | undefined = undefined
	export let _disabled = false
	export let href: string | undefined = undefined
	export { _disabled as disabled }

	export let onClick: (() => any) | undefined = undefined

	let loading = false
	let showLoader = false

	$: onClickPromise = async () => await onClick?.()

	$: iconOnly = !!icon && !$$slots.default
	$: disabled = _disabled || loading

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
			<Loader2 />
		{:else if icon}
			<svelte:component this={icon} />
		{/if}

		<slot />
	</a>
{:else}
	<button
		{type}
		{tabindex}
		{disabled}
		class:iconOnly
		class="size-{size}"
		class:disabled
		on:click={handleClick}
	>
		{#if showLoader}
			<Loader2 />
		{:else if icon}
			<svelte:component this={icon} />
		{/if}

		<slot />
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
