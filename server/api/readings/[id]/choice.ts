export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const readingId = getRouterParam(event, 'id') || ''
  const { getReading } = useModelReading()
  const reading = await getReading(user.sub, readingId)
  if (!reading) {
    throw createError({ statusCode: 404, statusMessage: 'Reading not found' })
  }

  if (!reading.choices || reading.choices.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No choices available for this reading' })
  }
  
  const body = await readBody(event)
  if (!body || typeof body.choice !== 'number' || body.choice < 0 || body.choice >= reading.choices.length) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid choice' })
  }

  const { generateNext, getHistory, updateHistory } = useModelReading()
  const history = await getHistory(user.sub, readingId) || ''
  const result = await generateNext(user.sub, reading, history, reading.choices[body.choice], body.locale || 'en')
  await updateHistory(user.sub, readingId, history + result.text)
  
  const { incrementCounter } = useModelProfile()
  await incrementCounter(user.email)

  return {
    ...reading,
    ...result
  } as Reading
})
