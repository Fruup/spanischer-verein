import { env } from '$env/dynamic/public'
import { MAILCHIMP_LIST_ID, MAILCHIMP_API_KEY } from '$env/static/private'

export const isRenderingNewsletter = env.PUBLIC_RENDERING_NEWSLETTER === 'true'

export default {
	MAILCHIMP_LIST_ID,
	MAILCHIMP_API_KEY,
}
