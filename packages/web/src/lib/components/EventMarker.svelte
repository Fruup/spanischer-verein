<div class="event-marker">
	<span class="left" />
	Event
	<span class="right" />
</div>

<style lang="scss">
	.event-marker {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		background-color: var(--color-primary);
		color: var(--color-white);
		font-weight: bold;
		font-size: 0.9rem;
		border-radius: 0.5rem;
		gap: 0.5rem;

		text-transform: uppercase;
		letter-spacing: 1.5px;
	}

	span {
		width: 2rem;
		height: 4px;
		background-color: coral;

		&.left {
			border-top-left-radius: 999px;
			border-bottom-left-radius: 999px;
		}

		&.right {
			border-top-right-radius: 999px;
			border-bottom-right-radius: 999px;
		}
	}
</style>
