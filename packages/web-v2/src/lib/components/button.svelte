<script lang="ts">
	import type { Component, Snippet } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	import Loader from '#lib/components/icons/loader.svelte'
	import { cn } from '#lib/utils.js'

	interface Props {
		type?: HTMLButtonAttributes['type']
		icon?: Component | undefined
		size?: 's' | 'm'
		tabindex?: number | undefined
		disabled?: boolean
		href?: string | undefined
		onClick?: (() => unknown) | undefined
		children?: Snippet
	}

	let {
		type = 'button',
		icon: Icon = undefined,
		size = 'm',
		tabindex = undefined,
		disabled: _disabled = false,
		href = undefined,
		onClick = undefined,
		children,
	}: Props = $props()

	let loading = $state(false)
	let showLoader = $state(false)

	let iconOnly = $derived(!!Icon && !children)
	let disabled = $derived(_disabled || loading)

	// `cn` merges conflicting utilities last-wins, so the size classes below
	// intentionally come after the icon-only ones.
	let classes = $derived(
		cn(
			'flex w-fit cursor-pointer items-center gap-[1ch] rounded-base border-none bg-brand px-4 py-3 text-base text-brand-contrast transition-colors duration-200 hover:bg-brand-hover',
			iconOnly && 'box-content aspect-square h-auto w-10 rounded-full p-0',
			size === 's' && 'size-8 text-xs',
			disabled && 'cursor-not-allowed opacity-50',
		),
	)

	async function handleClick() {
		if (!onClick) return

		loading = true

		let timer: ReturnType<typeof setTimeout>

		Promise.resolve(onClick()).finally(() => {
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
	<a {href} class={classes}>
		{#if showLoader}
			<Loader />
		{:else if Icon}
			<Icon />
		{/if}

		{@render children?.()}
	</a>
{:else}
	<button {type} {tabindex} {disabled} class={classes} onclick={handleClick}>
		{#if showLoader}
			<Loader />
		{:else if Icon}
			<Icon />
		{/if}

		{@render children?.()}
	</button>
{/if}
