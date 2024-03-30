<script lang="ts">
</script>

<div />

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	div {
		border-top: 2px solid $color-accent;
		height: 0;

		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			height: 10px;
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), white);
		}
	}
</style>
