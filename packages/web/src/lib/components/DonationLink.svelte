<script lang="ts">
	export let href: string
</script>

<a {href} target="_blank" rel="noreferrer nofollow"> Spenden via PayPal </a>

<style lang="scss">
	$color: #0070e0;

	a {
		text-wrap: nowrap;

		border: 1px solid $color;
		border-radius: 12px;

		transition: all 250ms ease;
		padding: 0.66rem 1rem;

		&:hover {
			background-color: change-color($color, $alpha: 0.1);
		}
	}
</style>
