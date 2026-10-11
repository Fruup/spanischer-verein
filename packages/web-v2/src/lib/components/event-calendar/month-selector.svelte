<script lang="ts">
	import { DropdownMenu } from 'bits-ui'
	import { tick } from 'svelte'

	import IconAngle from '../icons/icon-angle.svelte'

	interface Props {
		value?: { year: number; month: number }
	}

	let { value = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 } }: Props =
		$props()

	let open = $state(false)
	let menuElement = $state<HTMLDivElement | null>(null)

	const currentYear = new Date().getFullYear()
	const years = [currentYear - 1, currentYear, currentYear + 1]

	let months = $derived(
		Array.from({ length: 12 }, (_, monthIndex) =>
			new Date(2024, monthIndex).toLocaleDateString(undefined, { month: 'long' }),
		),
	)

	$effect(() => {
		if (!open) return

		// Scroll to the selected month.
		tick().then(() => {
			const activeAnchor = menuElement?.querySelector<HTMLAnchorElement>('a[data-active]')
			if (!activeAnchor || !menuElement) return

			menuElement.scrollTo({
				top: activeAnchor.offsetTop - menuElement.clientHeight / 2,
				behavior: 'smooth',
			})
		})
	})

	const isCurrent = (year: number, month: number) =>
		year === new Date().getFullYear() && month === new Date().getMonth() + 1

	const isActive = (year: number, month: number) => year === value.year && month === value.month
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger
		class="flex h-full w-full cursor-pointer flex-row items-center justify-center gap-1 rounded-base border-2 border-brand bg-surface-0 px-[1em] py-[0.5em] text-2xs tracking-label text-ink focus-ring transition-colors hover:bg-brand hover:text-brand-contrast"
	>
		<span>
			{months[value.month - 1]}
			{value.year}
		</span>

		<IconAngle direction="down" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		bind:ref={menuElement}
		sideOffset={4}
		align="center"
		class="z-[1000] max-h-[300px] overflow-y-auto rounded-base border border-edge bg-surface-raised text-sm shadow-floating data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		style="width: var(--bits-dropdown-menu-anchor-width)"
	>
		{#each years as year (year)}
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading
					class="sticky top-0 z-10 border-b border-edge-subtle bg-surface-raised px-[0.6em] py-[0.35em] text-2xs tracking-label text-ink-muted"
				>
					{year}
				</DropdownMenu.GroupHeading>

				<div class="p-[0.5em]">
					{#each months as monthString, monthIndex (monthIndex)}
						{@const month = monthIndex + 1}

						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a
									{...props}
									href="/archiv/{year}-{month.toString().padStart(2, '0')}"
									data-sveltekit-noscroll
									data-current={isCurrent(year, month) ? '' : undefined}
									data-active={isActive(year, month) ? '' : undefined}
									class="mb-[0.25em] block w-full rounded-base border-none bg-transparent px-[0.6em] py-[0.3em] text-left text-xs focus-ring transition-colors hover:bg-edge-subtle data-current:font-bold data-current:text-brand-link data-active:bg-brand data-active:text-brand-contrast"
								>
									{monthString}
								</a>
							{/snippet}
						</DropdownMenu.Item>
					{/each}
				</div>
			</DropdownMenu.Group>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
