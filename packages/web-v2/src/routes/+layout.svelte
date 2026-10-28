<script lang="ts">
	import './layout.css'
	import 'virtual:fonts.css'
	import { ModeWatcher } from 'mode-watcher'
	import type { LayoutProps } from './$types'
	import TooltipProvider from '#lib/components/ui/tooltip/tooltip-provider.svelte'

	let { children }: LayoutProps = $props()
</script>

<!--
	Follows the operating system preference by default, remembers an explicit
	choice, and sets the `dark` class before first paint so there is no flash.
-->
<ModeWatcher />

<TooltipProvider delayDuration={0} disableCloseOnTriggerClick>
	{@render children()}
</TooltipProvider>
