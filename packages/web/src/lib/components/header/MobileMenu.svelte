<script context="module" lang="ts">
	import { writable } from 'svelte/store'

	export const isMobileMenuOpen = writable(false)
</script>

<script lang="ts">
	import { createTreeView, melt } from '@melt-ui/svelte'
	import type { NavigationItem } from './types'
	import { setContext } from 'svelte'
	import MobileMenuTree from './MobileMenuTree.svelte'
	import { browser } from '$app/environment'
	import Drawer from '../ui/Drawer.svelte'

	export let items: NavigationItem[]

	const treeView = createTreeView({})

	const {
		elements: { tree },
	} = treeView

	setContext('mobileMenu', treeView)

	$: if (browser) {
		if ($isMobileMenuOpen) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}
</script>

<Drawer bind:open={$isMobileMenuOpen}>
	<nav use:melt={$tree} class="mobile-menu">
		<div class="header">
			<h3 class="heading">Navigation</h3>
		</div>

		<ul class="links" {...$tree}>
			<MobileMenuTree {items} />
		</ul>
	</nav>
</Drawer>

<style lang="scss">
	@import 'vars';

	.mobile-menu {
		overflow: auto;
		padding: 1rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	ul {
		padding: 0;
		margin: 0;
	}

	.heading {
		margin: 0;
	}
</style>
