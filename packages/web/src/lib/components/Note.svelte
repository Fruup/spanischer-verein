<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()
</script>

<p class="note">
	{@render children?.()}
</p>

<style lang="scss">
	.note {
		color: var(--color-text-1);
		text-align: center;
		margin-top: 3rem;
	}
</style>
