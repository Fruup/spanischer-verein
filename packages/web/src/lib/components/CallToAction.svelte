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

		border: 2px solid $color;

		border-radius: 8px;
		transition: all 250ms ease;
		padding: 0.5em 0.66em;
		padding: calc(0.5em - 2px) 0.5em;

		background-color: white;

		&:hover {
			background-color: change-color($color, $alpha: 0.1);
		}

		cursor: pointer;
	}
</style>
