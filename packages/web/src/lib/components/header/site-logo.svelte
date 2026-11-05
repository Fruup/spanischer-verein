<script lang="ts">
	import fallback from '#assets/logo-l.png?format=webp&h=400&imagetools'
	import { getSiteSettings } from '#lib/api/content-api.remote.js'

	interface Props {
		height: string
	}

	let { height }: Props = $props()

	const siteSettings = await getSiteSettings()
	const logo = siteSettings?.logo?.url || fallback

	/** The intrinsic size of the bundled fallback above. */
	const FALLBACK_RATIO = 1056 / 1112

	// Falls back whenever the dimensions are missing rather than emitting a
	// `NaN` ratio, which the browser drops — leaving the link to size itself
	// off the image again, the very thing this is here to avoid.
	const stored = siteSettings?.logo
	const ratio =
		stored && stored.width > 0 && stored.height > 0 ? stored.width / stored.height : FALLBACK_RATIO
</script>

<!--
	The link carries both of its own dimensions, so its box is known before the
	image has loaded and never depends on the image's own. The pair used to lean
	on each other — a `w-fit` link around an image sized `size-full` — which only
	resolves if the engine falls back to the image's intrinsic width for the
	shrink-to-fit pass. Safari does that with the full pixel width, blowing the
	link up to the image's natural size and squashing the logo flat inside the
	header.

	The width is multiplied out here rather than left to `aspect-ratio`, because
	the header centres the logo in an auto sized grid track: that track measures
	the link's max-content width, and Safari contributes nothing from a ratio in
	that pass, collapsing the link to zero and hiding the logo altogether.

	`object-contain` is the belt to that braces: if the stored dimensions ever
	disagree with the file, the logo is letterboxed rather than distorted.
-->
<a
	href="/"
	class="relative mx-auto block max-w-full rounded-base focus-ring"
	style:height
	style:width="calc({height} * {ratio})"
>
	<img
		src={logo}
		class="size-full object-contain"
		alt="Website-Logo 'Interkulturelle Zentren Köln, Antonio Machado'"
	/>
</a>
