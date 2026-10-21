<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte'

	import * as NavigationMenu from '../ui/navigation-menu'
	import type { NavigationItem } from './types'
	import { page } from '$app/state'
	import { cn } from '#lib/utils.ts'

	interface Props {
		navigationItem: NavigationItem
	}

	let { navigationItem }: Props = $props()

	const hasChildren = $derived(!!navigationItem.children?.length)
	const active = $derived(page.url.pathname === navigationItem.href)
</script>

<!--
	The top level entry is a real link even when it has a submenu, so the trigger
	renders as an `<a>`. Hovering opens the submenu, clicking navigates.
-->
<NavigationMenu.Item value={navigationItem.href}>
	{#if hasChildren}
		<NavigationMenu.Trigger
			class="h-auto gap-1 rounded-sm bg-transparent p-0 text-sm font-normal decoration-brand-link focus-ring transition-colors hover:bg-transparent hover:text-brand-link focus:bg-transparent data-open:bg-transparent data-open:text-brand-link data-open:hover:bg-transparent"
		>
			{#snippet child({ props })}
				<a
					{...props}
					href={navigationItem.href}
					class={cn(props.class as string, active && 'text-brand-link')}
				>
					{navigationItem.title}

					<ChevronDownIcon
						class="size-4 transition-transform duration-200 group-data-open/navigation-menu-trigger:rotate-180"
					/>
				</a>
			{/snippet}
		</NavigationMenu.Trigger>

		<NavigationMenu.Content
			class="z-50 min-w-[12ch] rounded-base border border-edge bg-surface-raised p-2 shadow-floating"
		>
			<ul class="m-0 p-0">
				{#each navigationItem.children ?? [] as item (item._key ?? item.href)}
					<li class="list-none">
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
			class={cn(
				'rounded-sm bg-transparent p-0 text-sm decoration-brand-link focus-ring transition-colors hover:bg-transparent hover:text-brand-link data-[active=true]:bg-transparent data-[active=true]:hover:bg-transparent',
				active && 'text-brand-link',
			)}
		>
			{navigationItem.title}
		</NavigationMenu.Link>
	{/if}
</NavigationMenu.Item>
