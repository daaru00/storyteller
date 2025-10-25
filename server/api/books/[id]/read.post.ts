export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const bookId = getRouterParam(event, 'id') || ''
  const { getBook } = useModelBook()
  const book = await getBook(bookId)
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }

  const body = await readBody(event)

  const { createReading, updateHistory } = useModelReading()
  let reading = await createReading(user.sub, book, body.locale || 'en')
  await updateHistory(user.sub, reading.id, reading.text)

  const { incrementCounter } = useModelProfile()
  await incrementCounter(user.email)

  return reading as Reading
})
