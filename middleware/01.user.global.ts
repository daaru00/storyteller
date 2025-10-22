export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const { isLoggedIn, loadCurrentUser } = useCustomAuth()
  if (!isLoggedIn.value) {
    await loadCurrentUser()
  }
})
