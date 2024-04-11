<script lang="ts">
	import MobileMenu from './MobileMenu.svelte'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenu from './SiteMenu.svelte'
	import imageUrl from '$assets/front-page.jpg'

	export let items: NavigationItem[]

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

	<div class="image left">
		<img src={imageUrl} alt="" />
	</div>

	<div class="image right">
		<img src={imageUrl} alt="" />
	</div>
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
			content: '';
			position: absolute;
			inset: 0;
			left: auto;
			max-width: 33%;
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
</style>
