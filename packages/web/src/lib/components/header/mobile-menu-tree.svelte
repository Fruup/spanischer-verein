<script lang="ts">
	import { getContext } from 'svelte'
	import { slide } from 'svelte/transition'

	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import IconAngle from '../icons/icon-angle.svelte'
	import MobileMenuTree from './mobile-menu-tree.svelte'
	import { MOBILE_MENU_CONTEXT, type MobileMenuContext } from './context'
	import { duration, motion } from '#lib/helpers/motion.js'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import { t } from '#lib/messages/index.ts'

	interface Props {
		items: ContentApi.NavigationItem[]
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
	{@const expanded = hasChildren && menu.isExpanded(id)}
	{@const current = page.url.pathname === href}

	<li style:--index={index} class="list-none border-b border-hairline last:border-b-0">
		<!--
			The row is a link plus, where there are children, a separate disclosure
			button: tapping the title goes to the section's own page, tapping the
			chevron opens it. Both targets are a full 48px tall, which is why the
			row is sized rather than padded.
		-->
		<div class="flex items-stretch gap-1">
			<a
				{href}
				aria-current={current ? 'page' : undefined}
				onclick={(event) => navigate(event, href)}
				class={[
					'flex min-h-12 grow items-center rounded-base px-2 focus-ring transition-colors',
					level > 1 ? 'text-sm' : 'text-base',
					current ? 'font-semibold text-brand-link' : 'hover:bg-surface-1',
				]}
			>
				{title}
			</a>

			{#if hasChildren}
				<button
					type="button"
					aria-expanded={expanded}
					aria-label={expanded ? t('collapse_submenu', { title }) : t('expand_submenu', { title })}
					onclick={() => menu.toggle(id)}
					class="grid min-h-12 w-12 shrink-0 cursor-pointer place-content-center rounded-base text-ink-muted focus-ring transition-colors hover:bg-surface-1"
				>
					<IconAngle direction={expanded ? 'up' : 'down'} transition />
				</button>
			{/if}
		</div>

		{#if expanded}
			<ul
				transition:slide={{ duration: motion(duration.fast) }}
				class="m-0 mb-2 ml-2 border-l-2 border-hairline p-0 pl-2"
			>
				<MobileMenuTree level={level + 1} items={children ?? []} />
			</ul>
		{/if}
	</li>
{/each}
