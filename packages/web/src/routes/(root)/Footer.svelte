<script lang="ts">
	// @ts-ignore
	import supporter1 from '$assets/integrationszentrum-koeln.png?format=webp&w=256&imagetools'
	import supporter2 from '$assets/stadt-koeln.svg'
	import SiteLogo from '$lib/components/header/SiteLogo.svelte'

	export let imprintUrl: string
</script>

<footer>
	<div>
		<h6>Links</h6>
		<nav>
			<ul>
				<!-- TODO(v2): make this configurable -->
				<li><a href="/">Home</a></li>
				<li><a href={imprintUrl}>Impressum</a></li>
			</ul>
		</nav>
	</div>

	<div>
		<h6>Unterstützer</h6>
		<ul>
			<li>
				<a href="https://www.ki-koeln.de/" target="_blank" rel="noreferrer nofollow">
					<img width="256" src={supporter1} alt="" />
				</a>
			</li>

			<li>
				<a href="https://www.stadt-koeln.de/" target="_blank" rel="noreferrer nofollow">
					<img width="256" src={supporter2} alt="" />
				</a>
			</li>
		</ul>
	</div>

	<div>
		<SiteLogo />

		<div class="attribution">
			Entwickelt von <a href="https://leonscherer.com/" target="_blank">Leon</a>
		</div>
	</div>
</footer>

<style lang="scss">
	@import 'vars';

	footer {
		font-size: 0.9rem;

		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 2rem;

		min-height: 200px;
		margin: 4rem;

		@include max-md {
			flex-direction: column;
		}
	}

	h6 {
		margin: 0;
		margin-bottom: 1rem;
		font-size: 1.3em;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	img {
		margin-bottom: 0.5em;
	}

	a {
		text-decoration: underline;
		text-decoration-color: $color-accent;
		text-decoration-thickness: 2px;
	}

	.attribution {
		text-align: center;
		font-size: 0.9em;
	}
</style>
