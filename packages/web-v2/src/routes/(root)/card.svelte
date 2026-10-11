<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		heading?: Snippet
		children?: Snippet
	}

	let { heading, children }: Props = $props()
</script>

<div
	class="rounded-base border border-edge-subtle bg-surface-raised p-5 text-ink shadow-raised [&_p]:leading-normal [&_p]:text-ink-muted [&>*]:my-2 [&>*:first-child]:mt-(--font-offset) [&>*:last-child]:mb-0"
>
	<div>
		<strong class="leading-normal [&_p]:text-ink">
			{@render heading?.()}
		</strong>
	</div>

	{@render children?.()}
</div>
