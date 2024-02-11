<script lang="ts">
	import { page } from '$app/stores'

	$: isTransformed = $page.url.pathname !== '/'
</script>

<div aria-hidden class="background-effect" class:transformed={isTransformed}>
	<div />
</div>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.background-effect {
		z-index: -1000;
		height: 0;
		overflow: visible;

		position: relative;

		// top: 100px;

		div {
			position: absolute;
			inset: 0;
			height: 100px;

			transform-origin: center;

			transform: skewY(-2deg) translateY(-10%);

			background-color: color.change($color-accent, $alpha: 1);

			transition: transform 500ms ease;
		}

		&.transformed div {
			background-color: color.change($color-accent, $alpha: 1);
			transform: scaleY(0.5) skewY(0) translateY(-150px);
			// transform: scaleY(1.2) skewY(1.5deg) translateY(25%);
		}
	}
</style>
