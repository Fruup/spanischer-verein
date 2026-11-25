<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		href?: string | undefined
		onclick?: (event: MouseEvent) => void
		children?: Snippet
	}

	let { href = undefined, onclick, children }: Props = $props()

	const classes =
		'focus-ring m-0 block cursor-pointer rounded-base border-2 border-donate bg-surface-raised px-2 py-[calc(0.5em-2px)] text-base text-nowrap transition-colors hover:bg-donate-wash'
</script>

{#if href}
	<a {href} target="_blank" rel="noreferrer nofollow" class={classes}>
		{@render children?.()}
	</a>
{:else}
	<button type="button" {onclick} class={classes}>
		{@render children?.()}
	</button>
{/if}
