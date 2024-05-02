<script lang="ts">
	import { melt, type TreeView } from '@melt-ui/svelte'
	import { getContext } from 'svelte'
	import Button from '../Button.svelte'
	import IconAngle from '../icons/IconAngle.svelte'
	import { goto } from '$app/navigation'
	import type { NavigationItem } from './types'
	import { isMobileMenuOpen } from './MobileMenu.svelte'

	export let items: NavigationItem[]

	export let level = 1
	export let shown = true

	const {
		elements: { item, group },
		states: { expanded },
		helpers: { isExpanded },
	} = getContext<TreeView>('mobileMenu')

	function toggleExpanded(id: string) {
		if (!$isExpanded(id)) {
			$expanded = [...$expanded, id]
		} else {
			$expanded = $expanded.filter((_id) => _id !== id)
		}
	}

	function navigate(href: string) {
		goto(href)
		$isMobileMenuOpen = false
	}
</script>

{#each items as { href, title, children }, index}
	{@const id = title + href}
	{@const hasChildren = !!children?.length}

	<li style:--index={index} class:shown>
		<div class="item">
			<a
				use:melt={$item({ id, hasChildren })}
				on:click|capture|preventDefault|stopPropagation={() => navigate(href)}
				{href}
			>
				{title}
			</a>

			{#if hasChildren}
				<Button size="s" tabindex={-1} icon={IconAngle} onClick={() => toggleExpanded(id)} />
			{/if}
		</div>

		{#if hasChildren}
			{@const shown = $isExpanded(id)}

			<ul use:melt={$group({ id })} class:shown>
				<svelte:self level={level + 1} items={children} shown={$isExpanded(id)} />
			</ul>
		{/if}
	</li>
{/each}

<style lang="scss">
	@import 'vars';

	.item {
		display: flex;
		flex-direction: row;
		gap: 1ch;
	}

	li {
		list-style: none;
	}

	a {
		text-decoration: underline;
		text-decoration-color: $color-accent;
	}

	ul {
		padding: 0;
		margin: 0;
		margin-left: 2rem;

		&:not(.shown) {
			display: none;
		}
	}

	li :global(button) {
		width: 1.5rem !important;
		height: 1.5rem !important;
	}
</style>
