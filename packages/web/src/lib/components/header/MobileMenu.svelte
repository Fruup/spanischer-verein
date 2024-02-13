<script lang="ts">
	import { createTreeView, melt } from '@melt-ui/svelte'
	import type { NavigationItem } from './Header.svelte'
	import { setContext } from 'svelte'
	import MobileMenuTree from './MobileMenuTree.svelte'
	import { browser } from '$app/environment'
	import Button from '../Button.svelte'
	import IconClose from '../icons/IconClose.svelte'
	import { fly } from 'svelte/transition'

	export let items: NavigationItem[]
	export let isOpen = false
	export let close: (() => void) | undefined

	const treeView = createTreeView({})

	const {
		elements: { tree },
	} = treeView

	setContext('mobileMenu', treeView)
	setContext('mobileMenuIsOpen', isOpen)

	$: if (browser) {
		if (isOpen) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}
</script>

{#if isOpen}
	<nav use:melt={$tree} transition:fly={{ x: 50 }} class="mobile-menu">
		<div class="header">
			<h3>Navigation</h3>

			<Button icon={IconClose} on:click={close} />
		</div>

		<ul class="links" {...$tree}>
			<MobileMenuTree {items} />
		</ul>
	</nav>
{/if}

<style lang="scss">
	@import 'vars';

	.mobile-menu {
		position: fixed;
		inset: 0 0 0 auto;
		z-index: 1000;
		width: min(100vw, 500px);
		padding: 3rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		background-color: $color-background;
		@include shadow;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	ul {
		padding: 0;
		margin: 0;
	}
</style>
