<script lang="ts">
	import type { MarkComponentProps } from '@portabletext/svelte'
	import IconBulb from '../icons/IconBulb.svelte'
	import IconTime from '../icons/IconTime.svelte'
	import type { InternalLinkMark } from '@spanischer-verein/sanity/schemas/blockContent'

	export let portableText: MarkComponentProps<InternalLinkMark>

	$: resolvedReference = portableText.value.resolvedReference
	$: type = resolvedReference._type
	$: href = (() => {
		switch (type) {
			case 'event':
				return `/event/${resolvedReference.slug}`
			case 'page':
				return `/${resolvedReference.slug}`
		}
	})()
</script>

<a class="internal-reference" {href}>
	<span class="icon">
		{#if type === 'event'}
			<IconTime />
		{:else if type === 'page'}
			<IconBulb />
		{/if}
	</span>

	<span>
		{portableText.plainTextContent}
	</span>
</a>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.internal-reference {
		padding: 0.125rem 0.4rem;
		font-size: 0.9em;

		background-color: color.adjust($color-background, $lightness: -5%);

		transition: background-color 200ms ease;

		border-radius: 999px;

		border: 1px solid transparent;

		&:hover {
			background-color: color.adjust($color-background, $lightness: -10%);
			border-color: $color-accent;
		}
	}

	.icon {
		font-size: 0.8rem;
	}
</style>
