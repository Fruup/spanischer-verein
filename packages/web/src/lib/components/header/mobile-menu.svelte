<script module lang="ts">
	let open = $state(false)

	/** Shared open state for the mobile navigation drawer. */
	export const mobileMenu = {
		get open() {
			return open
		},
		set open(value: boolean) {
			open = value
		},
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'

	import * as Drawer from '#lib/components/ui/drawer/index.js'

	import MobileMenuTree from './mobile-menu-tree.svelte'
	import { MOBILE_MENU_CONTEXT, type MobileMenuContext } from './context'
	import type { NavigationItem } from './types'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		items: NavigationItem[]
	}

	let { items }: Props = $props()

	// Replaces melt-ui's `createTreeView`; the tree is a plain set of expanded ids.
	const expanded = new SvelteSet<string>()

	setContext<MobileMenuContext>(MOBILE_MENU_CONTEXT, {
		isExpanded: (id) => expanded.has(id),
		toggle: (id) => (expanded.has(id) ? expanded.delete(id) : expanded.add(id)),
		close: () => (mobileMenu.open = false),
	})
</script>

<Drawer.Root bind:open={mobileMenu.open}>
	<Drawer.Content class="rounded-t-panel border-t border-edge-subtle shadow-floating">
		<nav class="flex w-full flex-col gap-4 overflow-auto p-6">
			<Drawer.Header class="flex items-center justify-between p-0">
				<Drawer.Title class="m-0 text-md">{t('navigation_label')}</Drawer.Title>
			</Drawer.Header>

			<ul class="m-0 flex flex-col gap-2 p-0">
				<MobileMenuTree {items} />
			</ul>
		</nav>
	</Drawer.Content>
</Drawer.Root>
