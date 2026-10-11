<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()
</script>

<div
	class="relative after:pointer-events-none after:absolute after:bottom-[-0.6rem] after:left-1/2 after:h-8 after:w-16 after:-translate-x-1/2 after:scale-120 after:[transform:rotateX(45deg)] after:content-[''] after:[background:radial-gradient(rgba(0,0,0,0.1)_0,transparent_30%)] after:[perspective-origin:center] after:[perspective:1000px]"
>
	{@render children?.()}
</div>
