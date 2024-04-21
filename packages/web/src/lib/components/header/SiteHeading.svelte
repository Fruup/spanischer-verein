<div class="site-heading">
	<h1 class="main">Spanische Kultur in Köln</h1>
	<span class="sub">
		Deutsch-Spanischer gemeinnütziger Kulturkreis<br />
		Machado e.V.
	</span>
</div>

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.site-heading {
		font-family: 'Old Standard TT', Georgia, serif;

		position: relative;
		width: fit-content;
		margin: auto;

		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 2rem auto;
	}

	.main {
		font-family: 'Old Standard TT', Georgia, serif;
		font-weight: 300;
		font-size: 2.5rem;

		margin: 0;
	}

	.sub {
		color: color.adjust($color-text, $alpha: -0.3);
		text-align: center;
		font-size: 1rem;
		line-height: 1.5;
	}
</style>
