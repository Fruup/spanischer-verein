<script lang="ts">
	import Button from '../Button.svelte'
	import IconBurger from '../icons/IconBurger.svelte'
	import HeaderLinkTop from './HeaderLinkTop.svelte'
	import type { NavigationItem } from './types'

	export let openMainMenu: () => any
	export let items: NavigationItem[]

	const homeItem: NavigationItem = {
		title: 'Home',
		href: '/',
	}
</script>

<nav>
	<ul>
		{#each [homeItem, ...items] as item}
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

	ul {
		width: 100%;
		max-width: 800px;
		margin: auto;
		padding: 0 2rem;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;

		gap: 2rem;
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
	}
</style>
