<script lang="ts">
	import { locale } from '#lib/locale/state.svelte.ts'
	import { DateFormatter } from '@internationalized/date'

	interface Props {
		time: string
	}

	let { time }: Props = $props()

	const dateFormatter = $derived(new DateFormatter(locale.current, { dateStyle: 'medium' }))
	const timeFormatter = $derived(new DateFormatter(locale.current, { timeStyle: 'short' }))
	const date = $derived(new Date(time))
</script>

<time class="text-ink-muted" datetime={date.toISOString()}
	>{dateFormatter.format(date)}&nbsp;{timeFormatter.format(date)}</time
>
