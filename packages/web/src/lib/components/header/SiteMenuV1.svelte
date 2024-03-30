<script lang="ts">
	import Button from '../Button.svelte'
	import IconBurger from '../icons/IconBurger.svelte'
	import HeaderLinkTop from './HeaderLinkTop.svelte'
	import type { NavigationItem } from './types'
	import logo from '$assets/logo-l.png'
	import SiteLogo from './SiteLogo.svelte'

	export let openMainMenu: () => any
	export let items: NavigationItem[]

	const pivot = Math.floor(items.length / 2)
	$: itemsLeft = items.slice(0, pivot)
	$: itemsRight = items.slice(pivot)
</script>

<nav>
	<ul class="left">
		{#each itemsLeft as item}
			<li class="link">
				<HeaderLinkTop navigationItem={item} />
			</li>
		{/each}
	</ul>

	<SiteLogo />

	<ul class="right">
		{#each itemsRight as item}
			<li class="link">
				<HeaderLinkTop navigationItem={item} />
			</li>
		{/each}

		<li class="main-menu-trigger">
			<Button icon={IconBurger} on:click={openMainMenu} />
		</li>
	</ul>
</nav>

<style lang="scss">
	@import 'vars';

	nav {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
	}

	ul {
		width: 100%;
		margin: auto;
		padding: 0 2rem;

		display: flex;
		flex-direction: row;
		align-items: center;

		gap: 2rem;

		&.left {
			justify-content: end;
		}

		&.right {
			justify-content: start;
		}
	}

	li {
		list-style: none;
	}

	.main-menu-trigger {
		display: none;
	}

	@include max-md {
		.main-menu-trigger {
			display: initial;
		}

		ul .link {
			display: none;
		}

		ul.right {
			justify-content: end;
		}
	}
</style>
