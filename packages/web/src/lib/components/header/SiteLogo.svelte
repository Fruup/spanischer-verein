<script lang="ts">
	import { page } from '$app/state'
	import fallback from '$assets/logo-l.png?format=webp&h=400&imagetools'

	let { href = '/', class: className }: { href?: string; class?: string } = $props()

	const logo = page.data.siteSettings?.logoUrl || fallback
</script>

<a {href} class="block h-[200px] {className}">
	<img
		src={logo}
		class="h-full"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>

<style lang="scss">
	a {
		display: block;
		width: fit-content;
		margin: auto;

		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: -20%;
			z-index: -1;

			background: radial-gradient(
				closest-side,
				white,
				rgba(255, 255, 255, 0.5),
				rgba(255, 255, 255, 0.5),
				rgba(255, 255, 255, 0.2),
				transparent
			);
		}
	}
</style>
