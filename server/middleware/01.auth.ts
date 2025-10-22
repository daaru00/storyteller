import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  if (!url.startsWith('/api/') || url.startsWith('/api/public/') || url.startsWith('/api/auth/')) {
    return
  }

  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  
  event.context.auth = session.user
})
