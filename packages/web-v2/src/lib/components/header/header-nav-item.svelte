<script lang="ts">
	import * as NavigationMenu from '../ui/navigation-menu'
	import type { NavigationItem } from './types'
	import { page } from '$app/state'

	interface Props {
		navigationItem: NavigationItem
	}

	let { navigationItem }: Props = $props()

	const pathname = $derived(page.url.pathname)
	const hasChildren = $derived(!!navigationItem.children?.length)
	const active = $derived(
		pathname === navigationItem.href ||
			navigationItem.children?.some((child) => child.href === pathname),
	)
</script>

<NavigationMenu.Item value={navigationItem.href}>
	{#if hasChildren}
		<NavigationMenu.Trigger class={['px-3 py-1 text-sm font-normal', active && 'text-brand']}>
			{navigationItem.title}
		</NavigationMenu.Trigger>

		<NavigationMenu.Content
			class="z-50 min-w-[20ch] rounded-base border border-edge p-2 shadow-floating"
		>
			<ul class="m-0 p-0 *:list-none">
				<li>
					<NavigationMenu.Link
						href={navigationItem.href}
						active={page.url.pathname === navigationItem.href}
						class="rounded-base px-2 py-1 text-sm focus-ring transition-colors hover:bg-edge-subtle"
					>
						Übersicht
					</NavigationMenu.Link>
				</li>

				{#each navigationItem.children ?? [] as item (item._key ?? item.href)}
					<li>
						<NavigationMenu.Link
							href={item.href}
							active={page.url.pathname === item.href}
							class="rounded-base px-2 py-1 text-sm focus-ring transition-colors hover:bg-edge-subtle"
						>
							{item.title}
						</NavigationMenu.Link>
					</li>
				{/each}
			</ul>
		</NavigationMenu.Content>
	{:else}
		<NavigationMenu.Link
			href={navigationItem.href}
			{active}
			class={[active && 'text-brand-link', 'px-3 py-1 text-sm']}
		>
			{navigationItem.title}
		</NavigationMenu.Link>
	{/if}
</NavigationMenu.Item>
