<script lang="ts">
	import Button from '../button.svelte'
	import IconBurger from '../icons/icon-burger.svelte'
	import * as NavigationMenu from '../ui/navigation-menu'
	import HeaderLinkTop from './header-link-top.svelte'
	import { mobileMenu } from './mobile-menu.svelte'
	import type { NavigationItem } from './types'

	interface Props {
		items: NavigationItem[]
	}

	let { items }: Props = $props()
</script>

<!--
	`viewport={false}` keeps every submenu anchored under its own top level entry
	instead of morphing one shared panel.
-->
<NavigationMenu.Root viewport={false} class="max-desktop:hidden">
	<NavigationMenu.List class="mx-auto w-full max-w-[800px] flex-wrap gap-8 px-8">
		{#each items as item (item._key ?? item.href)}
			<HeaderLinkTop navigationItem={item} />
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>

<div class="hidden max-desktop:block">
	<Button icon={IconBurger} onClick={() => (mobileMenu.open = true)} />
</div>
