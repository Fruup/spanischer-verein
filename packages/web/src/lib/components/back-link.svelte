<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte'

	import { t } from '#lib/messages/index.ts'

	interface Props {
		href: string
		/** Defaults to the events overview label. */
		label?: string | undefined
		class?: string | undefined
	}

	let { href, label = undefined, class: className = undefined }: Props = $props()
</script>

<a
	{href}
	class={[
		'group inline-flex items-center gap-1.5 rounded text-xs text-ink-muted focus-ring transition-colors hover:text-brand',
		className,
	]}
>
	<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-0.5" />
	{label ?? t('all_events')}
</a>
