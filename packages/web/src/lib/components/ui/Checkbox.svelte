<script lang="ts">
	interface Props {
		checked?: boolean
		name?: string
		label?: import('svelte').Snippet
	}

	let { checked = $bindable(false), name = '', label }: Props = $props()
</script>

<div class="checkbox">
	<div class="input-container">
		<input type="checkbox" {name} id={name} bind:checked />
	</div>

	{#if label}
		<label for={name}>
			{@render label?.()}
		</label>
	{/if}
</div>

<style lang="scss">
	@import 'vars';

	.checkbox {
		.input-container {
			display: grid;
			place-content: center;

			float: inline-start;

			width: 1lh;
			height: 1lh;
		}

		input {
			width: calc(1lh);
			height: calc(1lh);

			margin: 0;
		}

		label {
			:global(> *) {
				margin: 0;
			}
		}
	}
</style>
