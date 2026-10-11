import { defineEnvVars } from '@sveltejs/kit/env'

/**
 * SvelteKit 3 replaced `$env/static|dynamic/*` with an explicit declaration
 * here, consumed through `$app/env/private` and `$app/env/public`.
 *
 * All of these are optional, so each schema just passes the raw value through.
 */
export const variables = defineEnvVars({
	SANITY_PERSPECTIVE: {
		description: "Sanity perspective; defaults to 'published' in production.",
		schema: (value) => value,
	},
	SANITY_DATASET: {
		description: "Sanity dataset; defaults to 'production' in production.",
		schema: (value) => value,
	},
	SANITY_TOKEN: {
		description: 'Sanity read token.',
		schema: (value) => value,
	},
	MAIL_CREDENTIALS: {
		description: 'SMTP credentials as `user:password`.',
		schema: (value) => value,
	},
	MAIL_SERVER: {
		description: 'SMTP server as `host:port`.',
		schema: (value) => value,
	},
	ENABLE_CACHE: {
		description: 'Set to `true` to cache Sanity responses on disk.',
		schema: (value) => value?.toLowerCase() === 'true',
	},
	PUBLIC_RENDERING_NEWSLETTER: {
		public: true,
		static: true,
		description: 'Set to `true` by the newsletter build.',
		schema: (value) => value === 'true',
	},
	NEWSLETTER_SLUG: {
		description: 'The event slug the newsletter build prerenders.',
		schema: (value) => value,
	},
})
