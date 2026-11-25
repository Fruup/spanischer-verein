<script lang="ts">
	import './layout.css'
	import 'virtual:fonts.css'
	import fontPreloadHrefs from 'virtual:fonts-preload'
	import { ModeWatcher } from 'mode-watcher'
	import type { LayoutProps } from './$types'
	import TooltipProvider from '#lib/components/ui/tooltip/tooltip-provider.svelte'

	let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<!--
		Shortens the window before `font-display: swap` swaps in the webfont,
		so the metric-matched `* Fallback` face (see layout.css/fontPlugin.ts)
		spends less time on screen.
	-->
	{#each fontPreloadHrefs as href (href)}
		<link rel="preload" href={href} as="font" type="font/woff2" crossorigin="anonymous" />
	{/each}
</svelte:head>

<!--
	Follows the operating system preference by default, remembers an explicit
	choice, and sets the `dark` class before first paint so there is no flash.
-->
<ModeWatcher />

<TooltipProvider delayDuration={0} disableCloseOnTriggerClick>
	{@render children()}
</TooltipProvider>
