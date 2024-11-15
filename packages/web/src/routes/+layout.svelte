<script lang="ts">
	import '$lib/styles/globals.scss'
	
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
