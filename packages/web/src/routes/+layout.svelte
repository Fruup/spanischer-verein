<script lang="ts">
	import '../app.css'
	import '$lib/styles/globals.scss'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
</script>

{@render children?.()}
