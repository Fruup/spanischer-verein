<script module lang="ts">
	export const socialLinks = [
		{
			name: 'facebook',
			url: 'https://www.facebook.com/CentroMachado/',
		},
		{
			name: 'instagram',
			url: 'https://www.instagram.com/centromachado/',
		},
	]
</script>

<script lang="ts">
	import IconSocial from '../icons/icon-social.svelte'
</script>

<nav
	class="box-content flex h-6 justify-center gap-4 [&_a]:rounded-full [&_a]:transition-[scale] [&_a:hover]:scale-110"
>
	{#each socialLinks as { name, url: href } (href)}
		<a {href} target="_blank" rel="noreferrer nofollow">
			<IconSocial {name} />
		</a>
	{/each}
</nav>
