<script lang="ts">
	import { Drawer } from 'vaul-svelte'

	export let open = false
</script>

<Drawer.Root preventScroll={false} bind:open>
	<Drawer.Portal>
		<Drawer.Content class="drawer-content">
			<div class="handle" />
			<slot />
		</Drawer.Content>
		<Drawer.Overlay />
	</Drawer.Portal>
</Drawer.Root>

<style lang="scss" global>
	@import 'vars';

	.drawer-content {
		position: fixed;
		bottom: 0;
		width: 100%;
		min-height: 25vh;
		max-height: 99vh;
		background-color: white;

		display: flex;
		flex-direction: column;
		align-items: center;

		$r: 30px;
		border-top-left-radius: $r;
		border-top-right-radius: $r;

		@include shadow;

		.handle {
			display: grid;
			place-content: center;

			margin: 0.5rem;
			opacity: 0.2;

			&::after {
				content: '';
				width: 3rem;
				height: 6px;
				background-color: var(--color-text);
				border-radius: 999px;
			}
		}
	}
</style>
