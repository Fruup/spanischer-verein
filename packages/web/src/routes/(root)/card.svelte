<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		heading?: Snippet
		children?: Snippet
	}

	let { heading, children }: Props = $props()
</script>

<!-- TODO: maybe a small color touch in the top corner? ne kleine rote Ecke -->
<div
	class="rounded-base border border-edge-subtle bg-surface-raised p-5 text-ink-muted shadow-raised [&>*:first-child]:mt-(--font-offset) [&>*:last-child]:mb-0"
>
	<p class="mb-2 text-sm leading-snug font-semibold">
		{@render heading?.()}
	</p>

	<div class="flex flex-col gap-3 *:leading-snug">
		{@render children?.()}
	</div>
</div>
