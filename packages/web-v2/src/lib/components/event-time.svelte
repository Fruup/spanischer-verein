<script lang="ts">
	import { locale } from '#lib/services/locale.svelte.js'

	interface Props {
		time: string
	}

	let { time }: Props = $props()

	let date = $derived(new Date(time))

	let dateString = $derived(date.toLocaleDateString(locale.current))
	let hours = $derived(date.getHours().toString().padStart(2, '0'))
	let minutes = $derived(date.getMinutes().toString().padStart(2, '0'))
</script>

<time class="flex justify-center gap-2 text-ink-muted" datetime={date.toISOString()}>
	<span>{dateString}</span>
	<span>{hours}<sup class="text-[0.75em] underline">{minutes}</sup></span>
</time>
