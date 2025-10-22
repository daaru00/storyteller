export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const { getProfileImage } = useGravatar()
  user.image = getProfileImage(user.email)

  return user
})
