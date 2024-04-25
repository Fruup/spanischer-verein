<script lang="ts">
	import IconSocial from '../icons/IconSocial.svelte'
</script>

<nav class="social-links">
	<a href="https://www.facebook.com/CentroMachado/" target="_blank" rel="noreferrer nofollow">
		<IconSocial name="facebook" />
	</a>

	<a href="https://www.instagram.com/centromachado/" target="_blank" rel="noreferrer nofollow">
		<IconSocial name="instagram" />
	</a>
</nav>

<style lang="scss">
	@import 'vars';

	.social-links {
		height: 1.5rem;
		box-sizing: content-box;
		padding: 2rem;

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
