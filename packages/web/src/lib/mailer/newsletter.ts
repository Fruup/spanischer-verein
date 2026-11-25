import z from 'zod'

import type { Locale } from '#lib/locale/index.ts'
import { t } from '#lib/messages/index.ts'

/**
 * Shared by the client-side preflight and the server handler, so a bad address
 * or a missing consent box is reported in the form before a request goes out.
 *
 * `locale` is a getter because server call sites read it off the request event,
 * which only exists while the submission is being validated — on the client it
 * can be left out and the locale store is used.
 */
export const newsletterSchema = (locale?: () => Locale) =>
	z
		.object({
			email: z.email({ error: () => t('invalid_email', undefined, locale?.()) }),
			// An unchecked checkbox sends no value at all, so the field has to be
			// optional (SvelteKit rejects form schemas with a required boolean) and
			// the consent is enforced below, where `undefined` still reaches us.
			acceptPrivacy: z.boolean().optional(),
		})
		.refine(({ acceptPrivacy }) => acceptPrivacy === true, {
			path: ['acceptPrivacy'],
			error: () => t('newsletter_privacy_required', undefined, locale?.()),
		})
