<div class="card">
	<div>
		<strong>
			<slot name="heading" />
		</strong>
	</div>

	<slot />
</div>

<style lang="scss">
	@import 'vars';

	.card {
		@include surface;

		border-radius: var(--border-radius);
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);
		padding: 1rem;

		:global(> *) {
			margin: 0.5rem 0;
		}

		:global(> *:first-child) {
			margin-top: var(--font-offset);
		}

		:global(> *:last-child) {
			margin-bottom: 0;
		}

		strong {
			line-height: 1.5;

			:global(p) {
				opacity: 1 !important;
			}
		}

		:global(p) {
			line-height: 1.5;

			opacity: 0.8;
		}
	}

	// a {
	// 	text-decoration: underline;
	// 	text-decoration-color: $color-accent;

	// 	&:hover,
	// 	&:focus {
	// 		color: $color-accent;
	// 	}
	// }
</style>
