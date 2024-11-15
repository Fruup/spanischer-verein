<script lang="ts">
	import instagram from '$assets/instagram.png?w=64&h=64&format=webp&imagetools'
	import facebook from '$assets/facebook.png?w=64&h=64&format=webp&imagetools'

	interface Props {
		name: 'instagram' | 'facebook' | string;
	}

	let { name }: Props = $props();

	let url = $derived({
		instagram,
		facebook,
	}[name])
</script>

<img src={url} alt="{name} logo" />

<style>
	img {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}
</style>
