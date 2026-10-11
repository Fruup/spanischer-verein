<script lang="ts">
	import { DropdownMenu } from 'bits-ui'
	import { tick } from 'svelte'

	import IconAngle from '../icons/IconAngle.svelte'

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
		class="flex h-full w-full cursor-pointer flex-row items-center rounded-base border-2 border-brand bg-background px-[1em] py-[0.5em] text-[0.7rem] tracking-[1px] text-ink transition-all duration-100 ease-[ease] hover:bg-brand hover:text-white"
	>
		<span class="justify-self-center">
			{months[value.month - 1]}
			{value.year}
		</span>

		<IconAngle direction="down" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		bind:ref={menuElement}
		sideOffset={4}
		align="center"
		class="z-[1000] max-h-[300px] overflow-y-auto rounded-base border border-surface-1 bg-white text-[0.9rem] shadow-soft data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		style="width: var(--bits-dropdown-menu-anchor-width)"
	>
		{#each years as year (year)}
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading
					class="sticky top-0 border-b border-brand bg-surface-0 px-[0.5em] py-[0.25em]"
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
									class="mb-[0.25em] block w-full rounded-base border-none bg-transparent px-[0.5em] py-[0.25em] text-left text-[0.8em] hover:bg-surface-1 data-current:border data-current:border-ink-muted data-active:border data-active:border-brand/50"
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
