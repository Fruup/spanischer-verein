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

	import { page } from '$app/state'

	import * as Sheet from '#lib/components/ui/sheet/index.js'

	import MobileMenuTree from './mobile-menu-tree.svelte'
	import { MOBILE_MENU_CONTEXT, type MobileMenuContext } from './context'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		items: ContentApi.NavigationItem[]
	}

	let { items }: Props = $props()

	// Replaces melt-ui's `createTreeView`; the tree is a plain set of expanded ids.
	const expanded = new SvelteSet<string>()

	/**
	 * Ids of every branch between the root and the page being viewed. Opening
	 * the drawer somewhere three levels down should show where that page sits,
	 * not a collapsed list the visitor has to re-open by hand.
	 */
	const ancestorsOfCurrentPage = $derived.by(() => {
		const path = page.url.pathname
		const ids: string[] = []

		// Collects on the way back up, so a node is recorded only when the page
		// was found somewhere below it.
		const walk = (nodes: ContentApi.NavigationItem[]): boolean =>
			nodes.some((node) => {
				if (node.href === path) return true

				if (walk(node.children ?? [])) {
					ids.push(node.title + node.href)
					return true
				}

				return false
			})

		walk(items)

		return ids
	})

	$effect(() => {
		if (!mobileMenu.open) return

		for (const id of ancestorsOfCurrentPage) expanded.add(id)
	})

	setContext<MobileMenuContext>(MOBILE_MENU_CONTEXT, {
		isExpanded: (id) => expanded.has(id),
		toggle: (id) => (expanded.has(id) ? expanded.delete(id) : expanded.add(id)),
		close: () => (mobileMenu.open = false),
	})
</script>

<Sheet.Root bind:open={mobileMenu.open}>
	<Sheet.Content
		side="bottom"
		class="max-h-[85vh] gap-0 rounded-t-panel border-edge-subtle bg-background text-base shadow-floating"
	>
		<Sheet.Header class="shrink-0 gap-0 border-b border-hairline px-4 pt-4 pb-3">
			<Sheet.Title class="m-0 font-serif text-md leading-none">
				{t('navigation_label')}
			</Sheet.Title>
		</Sheet.Header>

		<!--
			The list scrolls on its own so the header stays put on a long tree, and
			the bottom padding clears the home indicator on phones that have one.
		-->
		<nav
			class="w-full overflow-y-auto overscroll-contain px-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
		>
			<ul class="m-0 flex flex-col p-0">
				<MobileMenuTree {items} />
			</ul>
		</nav>
	</Sheet.Content>
</Sheet.Root>
