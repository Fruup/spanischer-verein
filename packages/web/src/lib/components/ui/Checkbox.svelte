<script lang="ts">
	export let checked = false
	export let name = ''
</script>

<div class="checkbox">
	<div class="input-container">
		<input type="checkbox" {name} id={name} bind:checked />
	</div>

	{#if $$slots.label}
		<label for={name}>
			<slot name="label" />
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
