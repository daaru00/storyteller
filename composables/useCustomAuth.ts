export default function () {
  const currentUser = useState('user', (): AuthUser|null => null)
  const isLoggedIn = useState('logged', (): Boolean => false)
  const redirect = useCookie('redirect')

  const { signOut, signIn } = useAuth()
  const { getProfile } = useApi()

  return {
    loadCurrentUser: async () => {
      isLoggedIn.value = false

      try {
        currentUser.value = await getProfile()
        isLoggedIn.value = true
      } catch (error) {
        console.error(error)
        currentUser.value = null
      }

      return isLoggedIn.value
    },
    loginUser: async () => {
      let callbackUrl = '/'
      if (redirect.value) {
        callbackUrl = redirect.value.toString()
        redirect.value = null
      }
      await signIn(undefined, { callbackUrl })
    },
    logOutCurrentUser: async () => {
      try {
        await signOut({ callbackUrl: '/' })
      } catch (error) {}
      currentUser.value = null
      isLoggedIn.value = false
    },
    setRedirect: (path: string) => {
      redirect.value = path
    },
    isLoggedIn,
    currentUser,
  }
}
