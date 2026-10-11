<script lang="ts">
	import Button from '../Button.svelte'
	import IconBurger from '../icons/IconBurger.svelte'
	import HeaderLinkTop from './HeaderLinkTop.svelte'
	import { mobileMenu } from './MobileMenu.svelte'
	import type { NavigationItem } from './types'

	interface Props {
		items: NavigationItem[]
	}

	let { items }: Props = $props()
</script>

<nav>
	<ul
		class="mx-auto flex w-full max-w-[800px] flex-row flex-wrap items-center justify-center gap-8 px-8"
	>
		{#each items as item (item._key ?? item.href)}
			<li class="list-none max-desktop:hidden">
				<HeaderLinkTop navigationItem={item} />
			</li>
		{/each}

		<li class="hidden list-none max-desktop:block">
			<Button icon={IconBurger} onClick={() => (mobileMenu.open = true)} />
		</li>
	</ul>
</nav>
