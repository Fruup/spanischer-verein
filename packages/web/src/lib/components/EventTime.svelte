<script lang="ts">
	import { locale } from '$lib/services/locale'
	import IconTime from './icons/IconTime.svelte'

	export let time: string

	$: _time = new Date(time)

	$: date = _time.toLocaleDateString($locale)
	$: hours = _time.getHours().toString().padStart(2, '0')
	$: minutes = _time.getMinutes().toString().padStart(2, '0')
</script>

<time class="event-time" datetime={_time.toISOString()}>
	<IconTime />

	<span>{date}</span>
	<span>{hours}<sup>{minutes}</sup></span>
</time>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.event-time {
		font-size: 0.95rem;
		color: #666;

		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	sup {
		font-size: 0.75em;
		text-decoration: underline;
	}
</style>
