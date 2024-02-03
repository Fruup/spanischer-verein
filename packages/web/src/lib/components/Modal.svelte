<script lang="ts">
	import { fly } from 'svelte/transition'

	export let children: any
	export let open: boolean
</script>

<div class="backdrop">
	{#if open}
		<div class="modal" transition:fly={{ y: 20 }}>
			<!-- {@render children()} -->
		</div>
	{/if}
</div>

<style lang="scss">
	.backdrop {
		position: fixed;
		inset: 0;

		background-color: rgba(0, 0, 0, 0.2);

		display: grid;
		place-content: center;
	}

	.modal {
		background-color: white;
		border-radius: 12px;
		padding: 2rem;
	}
</style>
