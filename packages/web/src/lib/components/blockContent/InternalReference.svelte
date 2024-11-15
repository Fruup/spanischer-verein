<script lang="ts">
	import type { MarkComponentProps } from '@portabletext/svelte'
	import IconBulb from '../icons/IconBulb.svelte'
	import type { InternalLinkMark } from '@spanischer-verein/sanity/schemas/blockContent'
	import IconCalendar from '../icons/IconCalendar.svelte'

	interface Props {
		portableText: MarkComponentProps<InternalLinkMark>
	}

	let { portableText }: Props = $props()

	let resolvedReference = $derived(portableText.value.resolvedReference)
	let type = $derived(resolvedReference._type)
	let href = $derived(
		(() => {
			switch (type) {
				case 'event':
					return `/event/${resolvedReference.slug}`
				case 'page':
					return `/${resolvedReference.slug}`
			}
		})(),
	)
</script>

<a class="internal-reference" {href}>
	<span class="icon">
		{#if type === 'event'}
			<IconCalendar />
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
		display: inline-flex;
		align-items: center;
		gap: 0.25ch;

		// eyeballed it
		padding: 0 0.4em;
		padding-right: 0.6em;
		font-size: 0.9em;
		border-radius: 999px;

		background-color: color.adjust($color-background, $lightness: -5%);

		&:hover {
			background-color: color.adjust($color-background, $lightness: -10%);
			outline: 2px solid $color-accent;
		}
	}

	.icon {
		font-size: 0.8rem;
		display: contents;
	}
</style>
