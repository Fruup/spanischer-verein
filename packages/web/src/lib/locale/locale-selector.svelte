<script lang="ts">
	import { locales, type Locale } from '.'
	import { locale } from './state.svelte'
	import { t } from '#lib/messages/index.ts'
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.ts'
	import { GlobeIcon } from '@lucide/svelte'

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

<DropdownMenu.Root>
	<DropdownMenu.Trigger title={t('language_selection')}>
		<GlobeIcon class="size-4" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.RadioGroup bind:value={get, set}>
			{#each locales as locale}
				{@const active = locale === get()}

				<DropdownMenu.RadioItem value={locale} class={['text-xs', active && 'font-bold']}>
					{locale.toUpperCase()}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
