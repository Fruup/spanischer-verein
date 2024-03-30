<script lang="ts">
	import logo from '$assets/logo-l.png'
	import Button from '../Button.svelte'
	import HeaderLinkTop from './HeaderLinkTop.svelte'
	import MobileMenu from './MobileMenu.svelte'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'
	import IconBurger from '../icons/IconBurger.svelte'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteMenuV1 from './SiteMenuV1.svelte'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenuV2 from './SiteMenuV2.svelte'

	export let items: NavigationItem[]

	// const isMainMenuOpen = writable(false)
	$: isMainMenuOpen = !!$page.state.isMainMenuOpen

	function openMainMenu() {
		pushState('', { isMainMenuOpen: true })
	}

	function closeMainMenu() {
		history.back()
	}
</script>

<header>
	<!-- <SiteMenuV1 {items} {openMainMenu} /> -->

	<SiteLogo />

	<SiteHeading />

	<SiteMenuV2 {items} {openMainMenu} />
</header>

<MobileMenu isOpen={isMainMenuOpen} {items} close={closeMainMenu} />

<style lang="scss">
	@import 'vars';

	header {
		position: relative;

		overflow: visible;

		margin: 2rem;
		margin-bottom: 4rem;

		text-align: center;
	}
</style>
