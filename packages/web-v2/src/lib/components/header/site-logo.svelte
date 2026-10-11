<script lang="ts">
	import fallback from '#assets/logo-l.png?format=webp&h=400&imagetools'
	import { getSiteSettings } from '#lib/sanity/sanity.remote.js'

	const siteSettings = await getSiteSettings()
	const logo = siteSettings?.logoUrl || fallback
</script>

<a
	href="/"
	class="relative mx-auto block w-fit rounded-base focus-ring before:absolute before:-inset-[20%] before:-z-10 before:content-[''] before:[background:var(--logo-glow)]"
>
	<img
		src={logo}
		height="200px"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>
