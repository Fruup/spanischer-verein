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
		@include font-serif;

		position: relative;
		width: fit-content;
		margin: auto;

		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 2rem auto;
	}

	.main {
		@include font-serif;
		font-weight: 600;
		font-size: 2.5rem;
		font-style: italic;
		line-height: 1.1;

		margin: 0;
		margin-bottom: 1rem;

		text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
	}

	.sub {
		color: color.adjust($color-text, $alpha: -0.3);
		text-align: center;
		font-size: 1rem;
		line-height: 1.5;
	}
</style>
