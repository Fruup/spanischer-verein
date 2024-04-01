<script lang="ts">
	import MobileMenu from './MobileMenu.svelte'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenu from './SiteMenu.svelte'

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
