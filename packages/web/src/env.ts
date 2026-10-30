import { defineEnvVars } from '@sveltejs/kit/env'
import z from 'zod'

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
	ENABLE_CACHE: {
		description: 'Set to `true` to cache Sanity responses on disk.',
		schema: (value) => value?.toLowerCase() === 'true',
	},
	ORIGIN: {
		public: false,
		schema: z.url(),
	},
	HOSTINGER_MAIL_API_TOKEN: {
		public: false,
		schema: z.string().min(1),
	},
	HOSTINGER_MAIL_ADDRESS: {
		public: false,
		schema: z.email(),
	},
	HOSTINGER_MAIL_SENDER: {
		public: false,
		schema: z.string().min(1),
	},
	ADMIN_MAIL_ADDRESS: {
		public: true,
		schema: z.email(),
	},
	ALTCHA_SECRET: {
		public: false,
		schema: z.string().min(32),
	},
})
