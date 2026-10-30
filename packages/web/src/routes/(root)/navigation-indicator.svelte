<script lang="ts">
	import { navigating } from '$app/state'
	import { cubicOut } from 'svelte/easing'
	import { Tween } from 'svelte/motion'

	const opacity = new Tween(1, { easing: cubicOut, duration: 500 })
	const progress = new Tween(0, { easing: cubicOut, duration: 500 })

	let isNavigating = $state(false)
	let previousIsNavigating = false
	let interval: ReturnType<typeof setInterval> | undefined

	$effect(() => {
		if (!!navigating.complete) {
			const timeout = setTimeout(() => {
				isNavigating = true
			}, 100)

			return () => clearTimeout(timeout)
		} else {
			isNavigating = false
		}
	})

	$effect(() => {
		const changed = previousIsNavigating !== isNavigating
		previousIsNavigating = isNavigating
		if (!changed) return

		clearInterval(interval)

		if (isNavigating) {
			progress.set(0, { duration: 0 })
			opacity.set(1, { duration: 0 })

			const dt = 100
			interval = setInterval(() => {
				progress.target += 0.5 * (0.001 * dt) * (1 - progress.target)
			}, dt)
		} else {
			progress.set(1).then(() => {
				// If still not navigating
				if (!isNavigating) opacity.set(0)
			})
		}
	})

	const current = $derived(Math.max(Math.min(progress.current, 1), 0))
</script>

<div class="fixed top-0 z-100 h-1 w-screen" aria-hidden="true">
	<div
		style:width="{current * 100}%"
		style:opacity={opacity.current}
		class="relative h-full overflow-clip bg-amber-700 transition-opacity"
	>
		<div
			class="absolute top-0 right-0 bottom-0 w-20 bg-linear-to-r from-transparent to-background opacity-50"
		></div>
	</div>
</div>
