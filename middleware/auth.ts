export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSessionStore()
  if (!session.isAuthenticated) return navigateTo(`/login?next=${to.path}`)
})