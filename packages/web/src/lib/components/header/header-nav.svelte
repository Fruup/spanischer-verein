<script lang="ts">
	import * as NavigationMenu from '../ui/navigation-menu'
	import HeaderNavItem from './header-nav-item.svelte'
	import type { ContentApi } from '#lib/api/content-api.types.ts'

	interface Props {
		items: ContentApi.NavigationItem[]
	}

	let { items }: Props = $props()
</script>

<!--
	`viewport={false}` keeps every submenu anchored under its own top level entry
	instead of morphing one shared panel.
-->
<NavigationMenu.Root viewport={false} class="max-desktop:hidden">
	<NavigationMenu.List class="mx-auto w-full max-w-[800px] flex-wrap gap-1 px-8">
		{#each items as item (item._key ?? item.href)}
			<HeaderNavItem navigationItem={item} />
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>
