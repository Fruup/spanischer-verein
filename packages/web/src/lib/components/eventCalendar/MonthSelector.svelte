<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import { fly } from 'svelte/transition'
	import IconAngle from '../icons/IconAngle.svelte'
	import { tick } from 'svelte'

	let { value = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 } } = $props()

	let menuElement: HTMLDivElement

	const currentYear = new Date().getFullYear()
	const years = [currentYear - 1, currentYear, currentYear + 1]

	let months = $derived(
		Array.from({ length: 12 }, (_, monthIndex) =>
			new Date(2024, monthIndex).toLocaleDateString(undefined, { month: 'long' }),
		),
	)

	const {
		elements: { menu, trigger, group, groupLabel, item },
		states: { open },
	} = createDropdownMenu({
		preventScroll: false,
		positioning: {
			placement: 'bottom',
			sameWidth: true,
		},
	})

	$effect(() => {
		if ($open) {
			// Scroll to the selected month.
			tick().then(() => {
				const activeAnchor = menuElement.querySelector<HTMLAnchorElement>('a.active')
				if (!activeAnchor) return

				menuElement.scrollTo({
					top: activeAnchor.offsetTop - menuElement.clientHeight / 2,
					behavior: 'smooth',
				})
			})
		}
	})

	const isCurrent = (year: number, month: number) => {
		const current = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
		return year === current.year && month === current.month
	}

	const isActive = (year: number, month: number) => {
		return year === value.year && month === value.month
	}
</script>

<div class="month-selector">
	<button class="trigger" use:melt={$trigger}>
		<span class="value">
			{months[value.month - 1]}
			{value.year}
		</span>

		<IconAngle direction="down" />
	</button>

	{#if $open}
		<div
			class="menu"
			bind:this={menuElement}
			use:melt={$menu}
			transition:fly={{ y: 10, duration: 200 }}
		>
			{#each years as year}
				{@const yearString = year.toString()}

				<div use:melt={$group(yearString)}>
					<div class="group-label" use:melt={$groupLabel(yearString)}>
						{year}
					</div>

					<div class="options-container">
						{#each months as monthString, monthIndex}
							{@const month = monthIndex + 1}

							<a
								href="/archiv/{year}-{month.toString().padStart(2, '0')}"
								data-sveltekit-noscroll
								use:melt={$item}
								class:current={isCurrent(year, month)}
								class:active={isActive(year, month)}
							>
								{monthString}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.trigger {
		font-size: 0.7rem;

		width: 100%;
		height: 100%;

		letter-spacing: 1px;

		display: flex;
		flex-direction: row;
		align-items: center;

		padding: 0.5em 1em;
		border: 2px solid $color-accent;
		border-radius: var(--border-radius);

		cursor: pointer;

		transition: all 100ms ease;

		background: $color-background;
		color: var(--color-text);

		&:hover {
			background: $color-accent;
			color: white;
		}
	}

	.menu {
		font-size: 0.9rem;

		max-height: 300px;
		overflow-y: auto;

		z-index: 1000;
		background: white;
		border-radius: var(--border-radius);
		border: 1px solid var(--color-surface-1);

		@include shadow;
	}

	.options-container {
		padding: 0.5em;
	}

	a {
		font-size: 0.8em;

		display: block;
		width: 100%;
		padding: 0.25em 0.5em;
		margin-bottom: 0.25em;
		border: none;
		background: none;
		text-align: left;

		border-radius: var(--border-radius);

		&:hover {
			background: var(--color-surface-1);
		}

		&.current {
			border: 1px solid var(--color-text-1);
		}

		&.active {
			border: 1px solid color.change($color-accent, $alpha: 0.5);
		}
	}

	.group-label {
		position: sticky;
		top: 0;

		padding: 0.25em 0.5em;

		background-color: var(--color-surface-0);
		border-bottom: 1px solid $color-accent;
	}

	.value {
		justify-self: center;
	}
</style>
