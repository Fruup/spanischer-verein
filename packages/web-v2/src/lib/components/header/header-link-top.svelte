<script lang="ts">
	import { DropdownMenu } from 'bits-ui'

	import { ChevronDownIcon } from '@lucide/svelte'

	import type { NavigationItem } from './types'
	import { page } from '$app/state'

	interface Props {
		navigationItem: NavigationItem
	}

	let { navigationItem }: Props = $props()

	let open = $state(false)

	const hasChildren = $derived(!!navigationItem.children?.length)
	const active = $derived(page.url.pathname === navigationItem.href)
</script>

<!--
	The top level entry is a real link, and the submenu opens on hover, so the
	dropdown is controlled rather than trigger-driven.
-->
<div role="none" onmouseleave={() => (open = false)}>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<a
					{...props}
					href={navigationItem.href}
					onmouseenter={() => (open = hasChildren)}
					class={[
						'flex items-center gap-1 rounded-sm text-sm decoration-brand-link focus-ring transition-colors hover:text-brand-link',
						active && 'text-brand-link',
					]}
				>
					{navigationItem.title}

					{#if hasChildren}
						<ChevronDownIcon class="size-4" />
					{/if}
				</a>
			{/snippet}
		</DropdownMenu.Trigger>

		{#if hasChildren}
			<DropdownMenu.Content
				side="bottom"
				sideOffset={4}
				class="z-[1000] min-w-[12ch] rounded-base border border-edge bg-surface-raised p-2 shadow-floating data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
			>
				<DropdownMenu.Arrow class="border-t border-l border-edge" />

				<ul class="m-0 p-0">
					{#each navigationItem.children ?? [] as item (item._key ?? item.href)}
						<li class="list-none">
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a
										{...props}
										href={item.href}
										class="block rounded-base px-2 py-1 text-sm focus-ring transition-colors hover:bg-edge-subtle"
									>
										{item.title}
									</a>
								{/snippet}
							</DropdownMenu.Item>
						</li>
					{/each}
				</ul>
			</DropdownMenu.Content>
		{/if}
	</DropdownMenu.Root>
</div>
