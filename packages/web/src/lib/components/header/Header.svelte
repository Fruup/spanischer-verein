<script lang="ts">
	import MobileMenu from './MobileMenu.svelte'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenu from './SiteMenu.svelte'

	export let _items: NavigationItem[]
	export { _items as items }
	export let leftImageUrl: string | undefined = undefined
	export let rightImageUrl: string | undefined = undefined

	const homeItem: NavigationItem = {
		title: 'Home',
		href: '/',
	}

	$: items = [homeItem, ..._items]

	$: isMainMenuOpen = !!$page.state.isMainMenuOpen

	function openMainMenu() {
		pushState('', { isMainMenuOpen: true })
	}

	function closeMainMenu() {
		history.back()
	}
</script>

<header>
	<SiteLogo />
	<SiteHeading />
	<SiteMenu {items} {openMainMenu} />

	{#if leftImageUrl}
		<div class="image left">
			<img src={leftImageUrl} alt="" />
		</div>
	{/if}

	{#if rightImageUrl}
		<div class="image right">
			<img src={rightImageUrl} alt="" />
		</div>
	{/if}
</header>

<MobileMenu isOpen={isMainMenuOpen} {items} close={closeMainMenu} />

<style lang="scss">
	@import 'vars';

	header {
		position: relative;

		overflow: visible;

		padding: 2rem;
		padding-bottom: 4rem;

		text-align: center;

		.image {
			--max-width: 33%;

			@include max-md {
				--max-width: 20%;
			}

			content: '';
			position: absolute;
			inset: 0;
			left: auto;
			max-width: var(--max-width);
			height: 100%;

			z-index: -1000;

			img {
				object-fit: cover;
				width: 100%;
				height: 100%;
			}

			&::after {
				z-index: 1000;
				content: '';
				position: absolute;
				inset: 0;
				background: linear-gradient(to right, white, transparent 75%);
			}

			&.left {
				left: 0;
				right: auto;

				&::after {
					background: linear-gradient(to left, white, transparent 75%);
				}
			}
		}
	}

	@include max-md {
		.image {
			&.left {
				display: none;
			}

			&.right {
				--max-width: 100%;
				mask-image: linear-gradient(33deg, transparent 0%, transparent 50%, white);

				&::after {
					display: none;
				}
			}
		}
	}
</style>
