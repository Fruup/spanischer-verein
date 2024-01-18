<nav title="Navigation für Barrierefreiheit">
	<ul>
		<li>
			<a href="/"> Hello World </a>
		</li>
		<li>
			<a href="/"> Hello World 2 </a>
		</li>
	</ul>
</nav>

<style lang="scss">
	nav {
		position: fixed;

		opacity: 0;

		&:focus-within {
			opacity: 1;
		}
	}
</style>
