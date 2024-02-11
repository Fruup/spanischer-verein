<script lang="ts" context="module">
	export interface NavigationItem {
		label: string
		href: string
		children?: NavigationItem[]
	}
</script>

<script lang="ts">
	import logo from '$assets/logo-l.png'
	import HeaderLinkTop from './HeaderLinkTop.svelte'

	export let items: NavigationItem[] = [
		{
			label: 'Home',
			href: '/',
		},
		{
			label: 'Kurse',
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
			label: 'Aktivitäten',
			href: '/kurse',
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
			label: 'Öffnungszeiten',
			href: '/',
		},
	]

	const pivot = Math.floor(items.length / 2)
	$: itemsLeft = items.slice(0, pivot)
	$: itemsRight = items.slice(pivot)
</script>

<header>
	<nav>
		<ul class="left">
			{#each itemsLeft as item, index}
				<li>
					<HeaderLinkTop navigationItem={item} />
				</li>
			{/each}
		</ul>

		<a href="/">
			<img src={logo} width="200px" alt="MACHADO Logo" />
		</a>

		<ul class="right">
			{#each itemsRight as item, index}
				<li>
					<HeaderLinkTop navigationItem={item} />
				</li>
			{/each}
		</ul>
	</nav>

	<h1>Spanische Kultur in Köln</h1>
</header>

<style lang="scss">
	@import 'vars';

	header {
		position: relative;

		overflow: visible;

		margin: 2rem;
		margin-bottom: 6rem;

		text-align: center;
	}

	nav {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
	}

	ul {
		width: 100%;
		margin: auto;
		padding: 0 2rem;

		display: flex;
		flex-direction: row;
		align-items: center;

		gap: 2rem;

		&.left {
			justify-content: end;
		}

		&.right {
			justify-content: start;
		}
	}

	li {
		list-style: none;
	}

	h1 {
		font-family: 'Old Standard TT', Georgia, serif;
		font-weight: 300;
		font-size: 3rem;
	}
</style>
