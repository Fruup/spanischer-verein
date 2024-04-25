<script lang="ts">
	import MobileMenu from './MobileMenu.svelte'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenu from './SiteMenu.svelte'
	import SocialLinks from './SocialLinks.svelte'

	export let items: NavigationItem[]
	export let leftImageUrl: string | undefined = undefined
	export let rightImageUrl: string | undefined = undefined

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
	<SocialLinks />

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

		:global(.social-links) {
			position: absolute;
			bottom: 2rem;
			right: 2rem;
		}
	}
</style>
