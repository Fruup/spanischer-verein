<script lang="ts">
	import { locale } from '#lib/services/locale.svelte.js'
	import { DateFormatter } from '@internationalized/date'

	interface Props {
		time: string
	}

	let { time }: Props = $props()

	const dateFormatter = new DateFormatter(locale.current, { dateStyle: 'medium' })
	const timeFormatter = new DateFormatter(locale.current, { timeStyle: 'short' })
	const date = $derived(new Date(time))
</script>

<time class="text-ink-muted" datetime={date.toISOString()}
	>{dateFormatter.format(date)}&nbsp;{timeFormatter.format(date)}</time
>
