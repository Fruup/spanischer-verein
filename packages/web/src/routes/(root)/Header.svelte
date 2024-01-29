<script lang="ts">
	import { tick } from 'svelte'
	import { fly } from 'svelte/transition'
	import logo from '$assets/logo-l.png'

	let activeIndex = $state<number>()
	let overlayElement = $state<HTMLDivElement>() as HTMLDivElement
	let cancelTimer = $state<ReturnType<typeof setTimeout>>()

	interface NavigationItem {
		label: string
		href: string
		children?: NavigationItem[]
	}

	const items: NavigationItem[] = [
		{
			label: 'Home',
			href: '/',
			children: [
				// {
				// 	label: 'Sub 1',
				// 	href: '/sub1',
				// },
				// {
				// 	label: 'Sub 2',
				// 	href: '/sub2',
				// },
			],
		},
		{
			label: 'Kurse',
			href: '/kurse',
			children: [
				// {
				// 	label: 'Sub 1',
				// 	href: '/sub1',
				// },
				// {
				// 	label: 'Sub 2',
				// 	href: '/sub2',
				// },
				// {
				// 	label: 'Sub 2',
				// 	href: '/sub2',
				// },
				// {
				// 	label: 'Sub 2',
				// 	href: '/sub2',
				// },
			],
		},
	]

	const itemsLeft = $derived(items.slice(0, Math.floor(items.length / 2)))
	const itemsRight = $derived(items.slice(Math.floor(items.length / 2)))

	const activeItem = $derived(typeof activeIndex === 'number' ? items[activeIndex] : undefined)

	let cancelAnimation: (() => void) | undefined

	async function setActive(e: Event, i: number) {
		cancelAnimation?.()

		clearTimeout(cancelTimer)
		if (activeIndex === i) return

		const initial = typeof activeIndex === 'undefined'

		if (initial) {
			activeIndex = i
			await tick()
		}

		const target = e.target as HTMLDivElement
		let rect = target.getBoundingClientRect()

		const w0 = overlayElement.offsetWidth
		const x0 = overlayElement.offsetLeft

		// Switcheroo.
		activeIndex = i
		await tick()

		rect = target.getBoundingClientRect()
		const w1 = overlayElement.offsetWidth
		const x1 = target.offsetLeft + target.offsetWidth / 2

		// Animate
		const animation = overlayElement.animate(
			[
				{ left: `${initial ? x1 : x0}px`, width: `${w0}px` },
				{ left: `${x1}px`, width: `${w1}px` },
			],
			{
				duration: 500,
				easing: 'ease-in-out',
			},
		)

		cancelAnimation = () => animation.cancel()

		animation.addEventListener('finish', () => {
			overlayElement.style.left = `${x1}px`
		})
	}

	function onmouseleave() {
		cancelTimer = setTimeout(() => {
			activeIndex = undefined
		}, 200)
	}
</script>

{#snippet navigationItem({ item, index })}
	{@const onmouseover = (e: Event) => setActive(e, index)}
	{@const label = item.label}
	{@const href = item.href}

	<li>
		<a {onmouseover} {onmouseleave} onfocus={onmouseover} onblur={onmouseleave} {href}>
			{label}
		</a>
	</li>
{/snippet}

<header>
	<nav>
		<ul>
			{#each itemsLeft as item, index}
				{@render navigationItem({ item, index })}
			{/each}

			<li>
				<a href="/">
					<img src={logo} width="200px" alt="MACHADO Logo" />
				</a>
			</li>

			{#each itemsRight as item, index}
				{@render navigationItem({ item, index })}
			{/each}
		</ul>
	</nav>

	{#if activeItem}
		<div
			transition:fly={{ y: 10 }}
			bind:this={overlayElement}
			class="overlay surface-0"
			onmouseenter={() => clearInterval(cancelTimer)}
			{onmouseleave}
			tabindex="0"
			role="menu"
		>
			{#key activeItem}
				<div
					in:fly={{ x: 20, duration: 500, delay: 200 }}
					out:fly={{ x: -20, duration: 200 }}
					onoutrostart={(e) => ((e.target as any).style.position = 'absolute')}
				>
					<h1>{activeItem.label}</h1>

					{#if activeItem.children}
						<ul>
							{#each activeItem.children as { href, label }}
								<li>
									<a {href}>{label}</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/key}
		</div>
	{/if}
</header>

<style lang="scss">
	@import '../../lib/styles/vars.scss';

	header {
		position: relative;

		overflow: visible;

		margin: 2rem;
		margin-bottom: 6rem;

		text-align: center;
	}

	ul {
		margin: auto;
		width: fit-content;

		display: flex;
		flex-direction: row;
		// justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	li {
		list-style: none;
	}

	.overlay ul {
		flex-direction: column;
		align-items: start;
	}

	.overlay {
		// @include surface;
		@include shadow;

		position: absolute;
		top: 100%;
		left: 0;

		padding: 1rem;
		box-sizing: border-box;

		translate: -50%;

		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 12px;

		overflow: hidden;

		$arrow-size: 1rem;
		margin-top: $arrow-size;

		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: -100%;
			translate: -50%;

			width: $arrow-size;
			height: $arrow-size;

			background: red;
			z-index: 1;
		}
	}
</style>
