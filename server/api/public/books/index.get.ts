export default defineEventHandler(async (event) => {
  const { listBooks } = useModelBook()
  return await listBooks(event.context?.query?.nextToken)
})
