import { env } from '$env/dynamic/public'

export const isRenderingNewsletter = env.PUBLIC_RENDERING_NEWSLETTER === 'true'
