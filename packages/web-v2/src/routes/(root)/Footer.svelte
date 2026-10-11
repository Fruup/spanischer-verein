<script lang="ts">
	// @ts-ignore
	import supporter1 from '#assets/integrationszentrum-koeln.png?format=webp&w=256&imagetools'
	import supporter2 from '#assets/stadt-koeln.svg'
	import supporter3 from '#assets/interkulturelle-zentren-koeln.webp'
	import SiteLogo from '#lib/components/header/SiteLogo.svelte'
	import { socialLinks } from '#lib/components/header/SocialLinks.svelte'

	interface Props {
		imprintUrl: string | undefined
		privacyUrl: string | undefined
	}

	let { imprintUrl, privacyUrl }: Props = $props()
</script>

<footer
	class="m-16 flex min-h-[200px] flex-row justify-around gap-8 text-[0.9rem] max-desktop:flex-col max-tablet:m-8 [&_a]:underline [&_a]:decoration-brand [&_a]:decoration-2"
>
	<div>
		<h6 class="m-0 mb-4 text-[1.3em]">Links</h6>
		<nav>
			<ul class="list-none p-0">
				<!-- TODO(v2): make this configurable -->
				<li><a href="/">Home</a></li>

				{#if imprintUrl}
					<li><a href={imprintUrl}>Impressum</a></li>
				{/if}

				{#if privacyUrl}
					<li><a href={privacyUrl}>Datenschutz</a></li>
				{/if}

				{#each socialLinks as { name, url: href } (href)}
					<li>
						<a {href} target="_blank" rel="noreferrer nofollow">
							{name[0].toUpperCase() + name.slice(1)}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<div>
		<h6 class="m-0 mb-4 text-[1.3em]">Unterstützer</h6>
		<ul class="list-none p-0 [&_img]:mb-[0.5em]">
			<li>
				<a
					href="https://www.ki-koeln.de/"
					target="_blank"
					rel="noreferrer nofollow"
					title="Kommunales Integrationszentrum Köln"
				>
					<img width="256" src={supporter1} alt="" />
				</a>
			</li>

			<li>
				<a
					href="https://www.stadt-koeln.de/"
					target="_blank"
					rel="noreferrer nofollow"
					title="Stadt Köln"
				>
					<img width="256" src={supporter2} alt="" />
				</a>
			</li>

			<li>
				<a
					href="https://interkulturell.koeln/"
					target="_blank"
					rel="noreferrer nofollow"
					title="Interkulturelle Zentren Köln"
				>
					<img width="180" src={supporter3} alt="" />
				</a>
			</li>
		</ul>
	</div>

	<div>
		<SiteLogo />

		<div class="text-center text-[0.9em]">
			Entwickelt von <a href="https://leonscherer.com/" target="_blank">Leon</a>
		</div>
	</div>
</footer>
