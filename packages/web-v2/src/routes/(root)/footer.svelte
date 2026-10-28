<script lang="ts">
	// @ts-ignore
	import supporter1 from '#assets/integrationszentrum-koeln.png?format=webp&w=256&imagetools'
	import supporter2 from '#assets/stadt-koeln.svg'
	import supporter3 from '#assets/interkulturelle-zentren-koeln.webp'
	import SiteLogo from '#lib/components/header/site-logo.svelte'
	import SocialLinks from '#lib/components/header/social-links.svelte'
	import AdminLogin from '#lib/auth/admin-login.svelte'

	interface Props {
		imprintUrl: string | undefined
		privacyUrl: string | undefined
	}

	let { imprintUrl, privacyUrl }: Props = $props()

	const supporters = [
		{
			name: 'Kommunales Integrationszentrum Köln',
			url: 'https://www.ki-koeln.de/',
			logo: supporter1,
		},
		{
			name: 'Stadt Köln',
			url: 'https://www.stadt-koeln.de/',
			logo: supporter2,
		},
		{
			name: 'Interkulturelle Zentren Köln',
			url: 'https://interkulturell.koeln/',
			logo: supporter3,
		},
	]

	const year = new Date().getFullYear()
</script>

<!--
	Three columns on desktop — identity, navigation, supporters — collapsing to
	two and then one. The legal line sits below a hairline so the colophon reads
	as a footnote to the footer rather than another column.
-->
<footer class="text-sm">
	<div
		class="mx-auto box-content max-w-[1200px] px-10 pt-14 pb-10 max-desktop:pb-28 max-tablet:px-4 max-tablet:pt-10"
	>
		<div
			class="grid grid-cols-[1fr_auto_auto] gap-x-16 gap-y-10 max-desktop:grid-cols-2 max-tablet:grid-cols-1"
		>
			<!-- Identity -->
			<div class="flex flex-col items-start gap-5 max-tablet:items-center">
				<div class="w-fit">
					<SiteLogo height="72px" />
				</div>

				<p class="m-0 max-w-[32ch] text-xs leading-snug text-ink-muted max-tablet:text-center">
					Spanischer Verein Köln — Centro Cultural Antonio Machado. Sprache, Kultur und Begegnung
					mitten in Köln.
				</p>

				<div class="w-fit">
					<SocialLinks />
				</div>

				<AdminLogin />
			</div>

			<!-- Navigation -->
			<nav class="max-tablet:text-center">
				<h2 class="m-0 mb-4 text-2xs font-bold tracking-label text-ink-muted uppercase">Links</h2>

				<ul
					class="m-0 flex list-none flex-col gap-2 p-0 [&_a]:rounded-sm [&_a]:focus-ring [&_a]:transition-colors [&_a:hover]:text-brand-link"
				>
					<!-- TODO(v2): make this configurable -->
					<li><a href="/">Home</a></li>

					{#if imprintUrl}
						<li><a href={imprintUrl}>Impressum</a></li>
					{/if}

					{#if privacyUrl}
						<li><a href={privacyUrl}>Datenschutz</a></li>
					{/if}
				</ul>
			</nav>

			<!-- Supporters -->
			<div class="max-desktop:col-span-2 max-tablet:col-span-1 max-tablet:text-center">
				<h2 class="m-0 mb-4 text-2xs font-bold tracking-label text-ink-muted uppercase">
					Unterstützer
				</h2>

				<ul class="m-0 flex list-none flex-wrap items-center gap-3 p-0 max-tablet:justify-center">
					{#each supporters as { name, url: href, logo } (href)}
						<li>
							<!--
								The supporter marks are dark-on-transparent, so each one keeps a
								light tile of its own instead of inheriting the page surface.
							-->
							<a
								{href}
								target="_blank"
								rel="noreferrer nofollow"
								title={name}
								class="flex h-16 w-[150px] items-center justify-center rounded-base border border-edge-subtle bg-white px-3 py-2 focus-ring transition-shadow hover:shadow-raised"
							>
								<img src={logo} alt={name} class="max-h-full w-full object-contain" />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Colophon -->
		<div
			class="mt-12 flex flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-hairline pt-6 text-2xs text-ink-muted max-tablet:flex-col max-tablet:justify-center max-tablet:text-center"
		>
			<p class="m-0">© {year} Spanischer Verein Köln e.V.</p>

			<p class="m-0">
				Entwickelt von <a
					href="https://leonscherer.com/"
					target="_blank"
					class="rounded-sm underline decoration-brand-link decoration-2 underline-offset-4 focus-ring transition-colors hover:text-brand-link"
				>
					Leon
				</a>
			</p>
		</div>
	</div>
</footer>
