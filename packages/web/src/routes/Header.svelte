<script lang="ts">
	import { tick } from 'svelte'
	import { fly } from 'svelte/transition'

	let activeIndex = $state<number>()
	let overlayElement = $state<HTMLDivElement>() as HTMLDivElement
	let cancelTimer = $state<number>()

	const items = [
		{
			label: 'Home',
			href: '/',
			children: [
				{
					label: 'Sub 1',
					href: '/sub1',
				},
				{
					label: 'Sub 2',
					href: '/sub2',
				},
			],
		},
		{
			label: 'AboutAboutAbout',
			href: '/about',
			children: [
				{
					label: 'Sub 1',
					href: '/sub1',
				},
				{
					label: 'Sub 2',
					href: '/sub2',
				},
				{
					label: 'Sub 2',
					href: '/sub2',
				},
				{
					label: 'Sub 2',
					href: '/sub2',
				},
			],
		},
	]

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
		}, 500)
	}
</script>

<header>
	<nav>
		<ul>
			{#each items as { href, label }, i}
				{@const onmouseover = (e: Event) => setActive(e, i)}

				<li>
					<a {onmouseover} onfocus={onmouseover} {onmouseleave} {href}>
						{label}
					</a>
				</li>
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
	@import '../lib//styles/vars.scss';

	header {
		position: relative;

		overflow: visible;
	}

	ul {
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
