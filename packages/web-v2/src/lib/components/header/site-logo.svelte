<script lang="ts">
	import fallback from '#assets/logo-l.png?format=webp&h=400&imagetools'
	import { getSiteSettings } from '#lib/sanity/sanity.remote.js'

	const siteSettings = await getSiteSettings()
	const logo = siteSettings?.logoUrl || fallback
</script>

<a
	href="/"
	class="relative mx-auto block w-fit before:absolute before:-inset-[20%] before:-z-10 before:content-[''] before:[background:radial-gradient(closest-side,white,rgba(255,255,255,0.5),rgba(255,255,255,0.5),rgba(255,255,255,0.2),transparent)]"
>
	<img
		src={logo}
		height="200px"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>
