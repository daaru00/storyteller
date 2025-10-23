export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const readingId = getRouterParam(event, 'id') || ''
  const { getReading } = useModelReading()
  let reading = await getReading(user.sub, readingId)
  if (!reading) {
    throw createError({ statusCode: 404, statusMessage: 'Reading not found' })
  }

  return reading
})
