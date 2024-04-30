<script context="module" lang="ts">
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
	import IconSocial from '../icons/IconSocial.svelte'
</script>

<nav class="social-links">
	{#each socialLinks as { name, url: href }}
		<a {href} target="_blank" rel="noreferrer nofollow">
			<IconSocial {name} />
		</a>
	{/each}
</nav>

<style lang="scss">
	@import 'vars';

	.social-links {
		height: 1.5rem;
		box-sizing: content-box;

		display: flex;
		gap: 1rem;
		justify-content: center;

		a {
			transition: scale 0.25s ease;

			&:hover {
				scale: 1.1;
			}
		}
	}
</style>
