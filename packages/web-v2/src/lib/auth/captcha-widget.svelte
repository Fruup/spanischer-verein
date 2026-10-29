<script lang="ts">
	import { page } from '$app/state'

	$inspect(page.data.locale)

	let verified = $state(false)

	export const isVerified = () => verified
	export { isVerified as verified }
</script>

<altcha-widget
	style="--altcha-max-width: 100%"
	debug
	challenge="/altcha/challenge"
	auto="onload"
	language={page.data.locale}
	onverified={() => {
		verified = true

		const checkbox = document.querySelector<HTMLInputElement>('input[id^="altcha-checkbox-"]')
		if (checkbox) checkbox.disabled = true
	}}
></altcha-widget>
