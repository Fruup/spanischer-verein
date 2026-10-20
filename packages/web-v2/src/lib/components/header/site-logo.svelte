<script lang="ts">
	import fallback from '#assets/logo-l.png?format=webp&h=400&imagetools'
	import { getSiteSettings } from '#lib/sanity/sanity.remote.js'

	interface Props {
		height: string
	}

	let { height }: Props = $props()

	const siteSettings = await getSiteSettings()
	const logo = siteSettings?.logoUrl || fallback
</script>

<a href="/" class="relative mx-auto block w-fit rounded-base focus-ring" style:height>
	<img
		src={logo}
		class="size-full"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>
