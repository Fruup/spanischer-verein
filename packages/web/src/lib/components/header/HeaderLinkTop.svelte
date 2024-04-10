<script lang="ts">
	import { fly } from 'svelte/transition'
	import type { NavigationItem } from './Header.svelte'
	import { melt, createDropdownMenu } from '@melt-ui/svelte'
	import angleUrl from '$assets/angle.svg'

	export let navigationItem: NavigationItem

	const key = Math.random().toString(16)

	const {
		elements: { arrow, item, trigger, menu },
		states: { open },
	} = createDropdownMenu({
		portal: `[data-key="${key}"]`,
		preventScroll: false,
	})
</script>

<!-- 
  TODO: The top level link is not clickable via keyboard...
  Maybe add functionality to the dropdown menu that opens it on hover instead of click.
-->

<div data-key={key} role="tooltip" on:mouseleave={() => ($open = false)}>
	<a
		use:melt={$trigger}
		href={navigationItem.href}
		class:has-children={!!navigationItem.children?.length}
		style:--angleUrl="url({angleUrl})"
		on:mouseenter={() => ($open = true)}
	>
		{navigationItem.title}

		<div class="angle-down">
			<img aria-hidden="true" src={angleUrl} alt="" />
		</div>
	</a>

	{#if $open && !!navigationItem.children?.length}
		<div use:melt={$menu} transition:fly={{ y: 10, duration: 150 }} class="popup">
			<div use:melt={$arrow} class="arrow" />

			<ul>
				{#each navigationItem.children ?? [] as child, i}
					<li>
						<a use:melt={$item} href={child.href}>
							{child.title}
						</a>
					</li>{/each}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	@import 'vars';

	$color-border: rgba(0, 0, 0, 0.2);

	a {
		position: relative;

		text-decoration: underline;
		text-decoration-color: $color-accent;

		&:not(.has-children) .angle-down {
			display: none;
		}

		&.has-children .angle-down {
			position: absolute;
			left: 0;
			right: 0;
			top: 80%;
			bottom: auto;
		}
	}

	.arrow {
		border: 1px solid $color-border;
		border-width: 1px 0 0 1px;
	}

	.popup {
		padding: 1rem;
		background-color: $color-background;

		border: 1px solid $color-border;
		border-radius: 12px;

		z-index: 1000;

		@include shadow;
	}

	ul {
		margin: 0;
		padding: 0;

		li {
			list-style: none;
		}
	}

	li a {
		border-radius: 12px;
		padding: 0.5rem;

		&:hover,
		&:focus {
			background-color: rgba(0, 0, 0, 0.1);
		}
	}
</style>
