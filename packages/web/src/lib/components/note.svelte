<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()
</script>

<p class="mt-12 text-center text-sm text-ink-muted">
	{@render children?.()}
</p>
