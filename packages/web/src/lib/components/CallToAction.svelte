<script lang="ts">
	export let href: string | undefined = undefined
</script>

{#if href}
	<a {href} target="_blank" rel="noreferrer nofollow">
		<slot />
	</a>
{:else}
	<button type="button" on:click>
		<slot />
	</button>
{/if}

<style lang="scss">
	@import 'vars';

	$color: #0070e0;

	a,
	button {
		display: block;

		font-size: 1rem;
		margin: 0;

		text-wrap: nowrap;

		border: 1px solid $color;

		border-radius: 12px;
		transition: all 250ms ease;
		padding: 0.66em 1em;

		background-color: white;

		&:hover {
			background-color: change-color($color, $alpha: 0.1);
		}
	}
</style>
