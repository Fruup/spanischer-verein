<script lang="ts">
	import { getContext } from 'svelte'

	import { goto } from '$app/navigation'

	import Button from '../button.svelte'
	import IconAngle from '../icons/icon-angle.svelte'
	import MobileMenuTree from './mobile-menu-tree.svelte'
	import { MOBILE_MENU_CONTEXT, type MobileMenuContext } from './context'
	import type { NavigationItem } from './types'

	interface Props {
		items: NavigationItem[]
		level?: number
	}

	let { items, level = 1 }: Props = $props()

	const menu = getContext<MobileMenuContext>(MOBILE_MENU_CONTEXT)

	function navigate(event: MouseEvent, href: string) {
		event.preventDefault()
		event.stopPropagation()

		goto(href)
		menu.close()
	}
</script>

{#each items as { _key, href, title, children }, index (_key ?? href)}
	{@const id = title + href}
	{@const hasChildren = !!children?.length}

	<li style:--index={index} class="list-none">
		<div class="flex flex-row gap-[1ch]">
			<a
				{href}
				aria-expanded={hasChildren ? menu.isExpanded(id) : undefined}
				onclick={(event) => navigate(event, href)}
				class="underline decoration-brand"
			>
				{title}
			</a>

			{#if hasChildren}
				<Button size="s" tabindex={-1} icon={IconAngle} onClick={() => menu.toggle(id)} />
			{/if}
		</div>

		{#if hasChildren && menu.isExpanded(id)}
			<ul class="m-0 ml-8 p-0">
				<MobileMenuTree level={level + 1} items={children ?? []} />
			</ul>
		{/if}
	</li>
{/each}
