export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }
  
  if (['login', 'error'].includes(String(to.name))) {
    return
  }

  const { isLoggedIn, loginUser, setRedirect } = useCustomAuth()
  if (isLoggedIn.value) {
    return
  }

  if (!['home'].includes(String(to.name))) {
    setRedirect(to.path)
    return loginUser()
  }
})
