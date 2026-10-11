<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon'
	import SunIcon from '@lucide/svelte/icons/sun'
	import { mode, toggleMode } from 'mode-watcher'

	let isDark = $derived(mode.current === 'dark')
</script>

<button
	type="button"
	onclick={toggleMode}
	aria-label={isDark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
	title={isDark ? 'Heller Modus' : 'Dunkler Modus'}
	class="size-8 cursor-pointer rounded-full border border-edge bg-surface-raised/80 text-ink shadow-soft backdrop-blur-sm transition-colors duration-200 hover:border-brand hover:text-brand-link"
>
	{#if isDark}
		<SunIcon class="size-4" />
	{:else}
		<MoonIcon class="size-4" />
	{/if}
</button>
