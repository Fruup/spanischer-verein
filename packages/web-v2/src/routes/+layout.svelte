<script lang="ts">
	import './layout.css'
	import 'virtual:fonts.css'
	import type { LayoutProps } from './$types'

	let { children }: LayoutProps = $props()
</script>

{@render children()}
