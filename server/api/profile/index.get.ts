export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const { getProfile } = useModelProfile()
  const profile = await getProfile(user.email)

  const { getProfileImage } = useGravatar()
  profile.image = getProfileImage(profile.email)

  return profile
})
