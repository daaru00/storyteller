export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const { getProfile } = useModelProfile()
  const profile = await getProfile(user.email)

  return {
    ...user,
    ...profile
  } as Profile
})
