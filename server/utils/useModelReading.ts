import { QueryCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb" 

export default function() {
  const { client, tableName } = useDynamoDB()
  const readAttributes = ['id']

  return {
    listReadings: async (userId: string, nextToken?: string) => {
      const { Items: readings, LastEvaluatedKey } = await client.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'entity = :entity AND begins_with(id, :userId)',
        ExpressionAttributeValues: {
          ':entity': 'READ',
          ':userId': userId + '#'
        },
        ProjectionExpression: readAttributes.map(attr => `#${attr}`).join(', '),
        ExpressionAttributeNames: readAttributes.reduce((acc: Record<string, string>, attr) => {
          acc[`#${attr}`] = attr
          return acc
        }, {}),
        ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString('utf-8')) : undefined,
      }))

      return {
        readings,
        nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : undefined
      } as { readings: Reading[], nextToken?: string }
    },
    getReading: async (userId: string, bookId: string) => {
      const { Item: book } = await client.send(new GetCommand({
        TableName: tableName,
        Key: {
          entity: 'READ',
          id: userId + '#' + bookId
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

      return book as Reading
    },
    createReading: async (userId: string, bookId: string) => {
      const reading: Reading = {
        id: userId + '#' + bookId,
      }

      await client.send(new PutCommand({
        TableName: tableName,
        Item: {
          ...reading,
          entity: 'READ'
        }
      }))

      return reading
    }
  }
}
