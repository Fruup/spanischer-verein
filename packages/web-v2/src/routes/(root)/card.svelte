<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		heading?: Snippet
		children?: Snippet
	}

	let { heading, children }: Props = $props()
</script>

<div
	class="rounded-base bg-surface-raised p-4 text-ink shadow-card [&_p]:leading-normal [&_p]:opacity-80 [&>*]:my-2 [&>*:first-child]:mt-(--font-offset) [&>*:last-child]:mb-0"
>
	<div>
		<strong class="leading-normal [&_p]:opacity-100">
			{@render heading?.()}
		</strong>
	</div>

	{@render children?.()}
</div>
