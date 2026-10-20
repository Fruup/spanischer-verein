<script lang="ts">
	import type { Component } from 'svelte'
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'

	let {
		icon: Icon,
		children,
		description,
		class: className,
	}: {
		icon?: Component
		children: Snippet
		description?: Snippet
		class?: ClassValue
	} = $props()
</script>

<div
	class={[
		'relative pl-4 after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:rounded after:bg-brand',
		className,
	]}
>
	<h3 id="calendar" class="font-serif text-lg leading-none font-bold">
		<Icon class="inline size-5" />
		{@render children()}
	</h3>

	{#if description}
		<p class="mt-1 mb-4 text-xs leading-tight text-ink-muted">
			{@render description()}
		</p>
	{/if}
</div>
