<script lang="ts">
	import MobileMenu from './MobileMenu.svelte'
	import SiteHeading from './SiteHeading.svelte'
	import type { NavigationItem } from './types'
	import SiteLogo from './SiteLogo.svelte'
	import SiteMenu from './SiteMenu.svelte'
	import SocialLinks from './SocialLinks.svelte'
	import { fly } from 'svelte/transition'

	export let _items: NavigationItem[]
	export { _items as items }
	export let leftImageUrl: string | undefined = undefined
	export let rightImageUrl: string | undefined = undefined

	const homeItem: NavigationItem = {
		title: 'Home',
		href: '/',
	}

	$: items = [homeItem, ..._items]

	const transition = {
		x: 100,
		duration: 1000,
		opacity: 0,
	}
</script>

<header>
	<SiteLogo />
	<div id="scroll-to-marker" />
	<SiteHeading />
	<SiteMenu {items} />
	<SocialLinks />

	{#if leftImageUrl}
		{@const x = -transition.x}
		{@const duration = transition.duration}
		{@const opacity = transition.opacity}
		{@const delayOffset = 0}

		{#each [leftImageUrl] as url (url)}
			<div
				in:fly={{ x, duration, delay: duration / 2 + delayOffset, opacity }}
				out:fly={{ duration, delay: delayOffset, opacity }}
				class="image left"
			>
				<img src={url} alt="" />
			</div>
		{/each}
	{/if}

	{#if rightImageUrl}
		{@const x = transition.x}
		{@const duration = transition.duration}
		{@const opacity = transition.opacity}
		{@const delayOffset = duration / 4}

		{#each [rightImageUrl] as url (url)}
			<div
				in:fly={{ x, duration, delay: duration / 2 + delayOffset, opacity }}
				out:fly={{ duration, delay: delayOffset, opacity }}
				class="image right"
			>
				<img src={url} alt="" />
			</div>
		{/each}
	{/if}
</header>

<MobileMenu {items} />

<style lang="scss">
	@import 'vars';

	header {
		position: relative;

		overflow: visible;
		overflow-x: clip;

		max-height: 100vh;

		padding: 2rem;
		padding-bottom: 4rem;

		text-align: center;

		.image {
			--max-width: 33%;

			@include max-md {
				--max-width: 20%;
			}

			content: '';
			position: absolute;
			inset: 0;
			left: auto;
			max-width: var(--max-width);
			height: 100%;

			z-index: -1000;

			img {
				object-fit: cover;
				width: 100%;
				height: 100%;
			}

			&::after {
				z-index: 1000;
				content: '';
				position: absolute;
				inset: 0;
				background: linear-gradient(to right, white, transparent 75%);
			}

			&.left {
				left: 0;
				right: auto;

				&::after {
					background: linear-gradient(to left, white, transparent 75%);
				}
			}
		}

		:global(.social-links) {
			position: absolute;

			--gap: 2rem;
			bottom: var(--gap);
			right: var(--gap);

			@include max-md {
				--gap: 1rem;
			}
		}
	}

	#scroll-to-marker {
		visibility: hidden;
		height: 0;
	}

	@include max-md {
		.image {
			&.left {
				display: none;
			}

			&.right {
				--max-width: 100%;
				mask-image: linear-gradient(33deg, transparent 0%, transparent 50%, white);

				&::after {
					display: none;
				}
			}
		}
	}
</style>
