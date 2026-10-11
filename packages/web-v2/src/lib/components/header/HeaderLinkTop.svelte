<script lang="ts">
	import { DropdownMenu } from 'bits-ui'

	import angleUrl from '#assets/angle.svg'

	import type { NavigationItem } from './types'

	interface Props {
		navigationItem: NavigationItem
	}

	let { navigationItem }: Props = $props()

	let open = $state(false)

	let hasChildren = $derived(!!navigationItem.children?.length)
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
					class="relative tracking-[1px] underline decoration-brand"
				>
					{navigationItem.title}

					{#if hasChildren}
						<span class="absolute top-[80%] right-0 left-0">
							<img aria-hidden="true" src={angleUrl} alt="" class="size-[1em]" />
						</span>
					{/if}
				</a>
			{/snippet}
		</DropdownMenu.Trigger>

		{#if hasChildren}
			<DropdownMenu.Content
				side="bottom"
				sideOffset={4}
				class="z-[1000] rounded-base border border-black/20 bg-background p-4 shadow-soft data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
			>
				<DropdownMenu.Arrow class="border-t border-l border-black/20" />

				<ul class="m-0 p-0">
					{#each navigationItem.children ?? [] as item (item._key ?? item.href)}
						<li class="list-none">
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a
										{...props}
										href={item.href}
										class="block rounded-base p-0.5 hover:bg-black/10 focus:bg-black/10"
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
