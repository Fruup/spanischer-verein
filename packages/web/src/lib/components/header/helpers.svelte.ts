import { page } from '$app/state'

export const isMainPage = () => page.url.pathname === '/'
