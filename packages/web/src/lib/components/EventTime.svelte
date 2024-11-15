<script lang="ts">
	import { locale } from '$lib/services/locale'

	interface Props {
		time: string
	}

	let { time }: Props = $props()

	let _time = $derived(new Date(time))

	let date = $derived(_time.toLocaleDateString($locale))
	let hours = $derived(_time.getHours().toString().padStart(2, '0'))
	let minutes = $derived(_time.getMinutes().toString().padStart(2, '0'))
</script>

<time class="event-time" datetime={_time.toISOString()}>
	<span>{date}</span>
	<span>{hours}<sup>{minutes}</sup></span>
</time>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.event-time {
		color: var(--color-text-1);

		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	sup {
		font-size: 0.75em;
		text-decoration: underline;
	}
</style>
