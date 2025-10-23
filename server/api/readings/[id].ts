export default defineEventHandler(async (event) => {
  const user = event.context.auth

  const bookId = getRouterParam(event, 'id') || ''
  const { getBook } = useModelBook()
  const book = await getBook(bookId)
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }
  
  const { getReading, createReading } = useModelReading()
  let reading = await getReading(user.id, book.id)
  if (!reading) {
    reading = await createReading(user.id, book.id)
  }

  return reading
})
