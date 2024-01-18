<script lang="ts">
	let { children } = $props<{ children: any }>()
</script>

<div class="shadow-container">
	{@render children()}
</div>

<style lang="scss">
	.shadow-container {
		position: relative;
	}

	:global(.shadow-container::after) {
		content: '';
		position: absolute;

		left: 50%;
		bottom: -0.6rem;
		width: 4rem;
		height: 2rem;

		perspective-origin: center;
		perspective: 1000px;
		transform: rotateX(45deg);

		scale: 1.2;
		translate: -50%;

		background: radial-gradient(rgba(0, 0, 0, 0.1) 0, transparent 30%);
		pointer-events: none;
	}
</style>
