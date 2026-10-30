<script lang="ts">
	import { locales, type Locale } from '.'
	import { locale } from './state.svelte'
	import { t } from '#lib/messages/index.ts'

	const get = () => locale.current

	const set = (newValue: Locale) => {
		locale.current = newValue

		cookieStore.set({
			name: 'locale',
			value: newValue,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).valueOf(),
		})
	}
</script>

<div role="radiogroup" class="flex items-center divide-x text-xs" title={t('language_selection')}>
	{#each locales as locale}
		{@const active = locale === get()}

		<button
			type="button"
			role="radio"
			aria-checked={active}
			onclick={() => set(locale)}
			class={[active && 'font-bold', 'cursor-pointer px-1 first:pl-0 last:pr-0']}
		>
			{locale.toUpperCase()}
		</button>
	{/each}
</div>
