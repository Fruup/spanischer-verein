<script lang="ts">
	import { page } from '$app/stores'
	import fallback from '$assets/logo-l.png?format=webp&w=200&imagetools'

	const logo = $page.data.siteSettings?.logoUrl || fallback
</script>

<a href="/">
	<img
		src={logo}
		width="200px"
		height="200px"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>
