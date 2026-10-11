<script lang="ts">
	import './layout.css'
	import 'virtual:fonts.css'
	import { ModeWatcher } from 'mode-watcher'
	import type { LayoutProps } from './$types'

	let { children }: LayoutProps = $props()
</script>

<!--
	Follows the operating system preference by default, remembers an explicit
	choice, and sets the `dark` class before first paint so there is no flash.
-->
<ModeWatcher />

{@render children()}
