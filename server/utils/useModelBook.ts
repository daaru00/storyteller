import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb" 

export default function() {
  const { client, tableName } = useDynamoDB()
  const readAttributes = ['id', 'title', 'genre', 'summary', 'imageUrl']

  return {
    listBooks: async (nextToken?: string) => {
      const { Items: books, LastEvaluatedKey } = await client.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'entity = :entity',
        ExpressionAttributeValues: {
          ':entity': 'BOOK'
        },
        ProjectionExpression: readAttributes.map(attr => `#${attr}`).join(', '),
        ExpressionAttributeNames: readAttributes.reduce((acc: Record<string, string>, attr) => {
          acc[`#${attr}`] = attr
          return acc
        }, {}),
        ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8')) : undefined,
      }))

      return {
        books,
        nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : undefined
      } as { books: Book[], nextToken?: string }
    },
    getBook: async (bookId: string) => {
      const { Item: book } = await client.send(new GetCommand({
        TableName: tableName,
        Key: {
          entity: 'BOOK',
          id: bookId
        },
        ProjectionExpression: readAttributes.map(attr => `#${attr}`).join(', '),
        ExpressionAttributeNames: readAttributes.reduce((acc: Record<string, string>, attr) => {
          acc[`#${attr}`] = attr
          return acc
        }, {}),
      }))

      if (!book) {
        throw new Error('Book not found')
      }

      return book as Book
    }
  }
}
