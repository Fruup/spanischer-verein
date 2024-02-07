import env from '$env/static/public'

export const isRenderingNewsletter = env.PUBLIC_RENDERING_NEWSLETTER === 'true'
