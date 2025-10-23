export default defineEventHandler(async (event) => {
  const user = event.context.auth
  
  const { listReadings } = useModelReading()
  return await listReadings(user.id, event.context?.query?.nextToken)
})
