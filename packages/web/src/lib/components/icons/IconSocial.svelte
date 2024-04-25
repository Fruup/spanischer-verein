<script lang="ts">
	import instagram from '$assets/instagram.png?w=64&h=64&format=webp&imagetools'
	import facebook from '$assets/facebook.png?w=64&h=64&format=webp&imagetools'

	export let name: 'instagram' | 'facebook'

	$: url = {
		instagram,
		facebook,
	}[name]
</script>

<img src={url} alt="{name} logo" />

<style>
	img {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}
</style>
