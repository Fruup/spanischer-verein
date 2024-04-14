<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte'
	import { fade, fly } from 'svelte/transition'
	import IconAngle from '../icons/IconAngle.svelte'

	export let value = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }

	const years = [2024, 2023]

	$: months = Array.from({ length: 12 }, (_, monthIndex) =>
		new Date(2024, monthIndex).toLocaleDateString(undefined, { month: 'long' }),
	)

	const {
		elements: { trigger, option, menu, group, groupLabel },
		states: { open },
	} = createSelect({
		preventScroll: false,
		positioning: {
			placement: 'bottom',
			sameWidth: true,
		},
	})

	const handleSelect = (year: number, month: number) => {
		value = {
			year,
			month,
		}
	}

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
		<div class="menu" use:melt={$menu} transition:fly={{ y: 10, duration: 200 }}>
			{#each years as year}
				{@const yearString = year.toString()}

				<div use:melt={$group(yearString)}>
					<div class="group-label" use:melt={$groupLabel(yearString)}>
						{year}
					</div>

					{#each months as monthString, monthIndex}
						{@const month = monthIndex + 1}

						<a
							href="/archiv/{year}-{month.toString().padStart(2, '0')}"
							data-sveltekit-noscroll
							use:melt={$option({ value: month, label: monthString })}
							class:current={isCurrent(year, month)}
							class:active={isActive(year, month)}
						>
							{monthString}
						</a>
					{/each}
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
		border-radius: 8px;

		cursor: pointer;

		transition: all 100ms ease;

		&:hover {
			background: $color-accent;
			color: white;
		}
	}

	.menu {
		font-size: 0.8rem;

		max-height: 300px;
		overflow-y: auto;
		padding: 0.5em;
		margin: 0 2em;

		z-index: 1000;
		background: white;
		border-radius: 12px;
		border: 1px solid var(--color-surface-1);

		@include shadow;
	}

	a {
		font-size: 0.8em;

		display: block;
		width: 100%;
		padding: 0.5em 1em;
		border: none;
		background: none;
		text-align: left;

		border-radius: 8px;
		// border: 1px solid transparent;

		&:hover {
			background: var(--color-surface-1);
		}

		&.current {
			border: 1px solid var(--color-text-1);
		}

		&.active {
			border: 1px solid change-color($color-accent, $alpha: 0.5);
		}
	}

	.group-label {
		border-bottom: 1px solid $color-accent;

		margin: 0.5em 0;
	}

	.value {
		justify-self: center;
	}
</style>
