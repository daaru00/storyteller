export default defineEventHandler(async (event) => {
  const bookId = getRouterParam(event, 'id') || ''
  const { getBook } = useModelBook()
  const book = await getBook(bookId)
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }
  return book
})
