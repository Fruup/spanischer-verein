<script lang="ts">
	import { locale } from '#lib/locale/state.svelte.ts'

	import 'altcha'
	import 'altcha/i18n/de'
	import 'altcha/i18n/es-es'

	let verified = $state(false)

	export const isVerified = () => verified
	export { isVerified as verified }
</script>

<altcha-widget
	style="--altcha-max-width: 100%"
	challenge="/altcha/challenge"
	auto="onload"
	language={locale.current}
	onstatechange={(
		e: CustomEvent<{
			state: 'verifying' | 'verified' | 'unverified'
		}>,
	) => {
		const { state } = e.detail
		verified = state === 'verified'
	}}
></altcha-widget>
