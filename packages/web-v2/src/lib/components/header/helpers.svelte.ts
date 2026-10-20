import { page } from '$app/state'

export const isMainPage = () => page.url.pathname === '/' || page.url.pathname.startsWith('/archiv')
