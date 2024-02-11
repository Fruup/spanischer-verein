<script lang="ts">
	import { melt, type TreeView } from '@melt-ui/svelte'
	import type { NavigationItem } from './Header.svelte'
	import { getContext } from 'svelte'
	import Button from '../Button.svelte'
	import IconAngle from '../icons/IconAngle.svelte'
	import { fly } from 'svelte/transition'
	import { goto } from '$app/navigation'

	export let items: NavigationItem[]

	export let level = 1
	export let shown = true

	const {
		elements: { item, group },
		states: { expanded, selectedItem },
		helpers: { isExpanded },
	} = getContext<TreeView>('mobileMenu')

	function toggleExpanded(id: string) {
		if (!$isExpanded(id)) {
			$expanded = [...$expanded, id]
		} else {
			$expanded = $expanded.filter((_id) => _id !== id)
		}
	}
</script>

{#each items as { href, label, children }, index}
	{@const id = label + href}
	{@const hasChildren = !!children?.length}

	<li style:--index={index} class:shown>
		<div class="item">
			<a
				use:melt={$item({ id, hasChildren })}
				on:click|capture|preventDefault|stopPropagation={() => goto(href)}
				{href}
			>
				{label}
			</a>

			{#if hasChildren}
				<Button size="s" tabindex={-1} icon={IconAngle} on:click={() => toggleExpanded(id)} />
			{/if}
		</div>

		{#if hasChildren}
			<!-- {#if hasChildren && $isExpanded(id)} -->
			<ul use:melt={$group({ id })} class:shown={$isExpanded(id)}>
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

		translate: 50px;

		transition: translate 200ms ease;
		transition-delay: calc(var(--index) * 50ms);

		.shown {
			translate: 0;
		}
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
</style>
