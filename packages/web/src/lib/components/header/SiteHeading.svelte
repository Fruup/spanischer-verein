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
		font-size: 3rem;

		margin: 0;
	}

	.sub {
		color: color.adjust($color-text, $alpha: -0.3);
		text-align: center;
		font-size: 1.25rem;
		line-height: 1.5em;
	}

	@include min-md {
		.sub {
			position: relative;
			left: 100px;

			text-align: right;
			align-self: end;
		}
		// .sub {
		// 	position: absolute;
		// 	right: -5rem;
		// 	bottom: 0;
		// 	translate: 0 100%;
		// }
	}
</style>
