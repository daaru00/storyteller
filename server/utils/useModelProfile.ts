import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb" 

export default function() {
  const { client, tableName } = useDynamoDB()
  const readAttributes = ['givenName','familyName','locale', 'preferences', 'disabled']
  const writeAttributes = ['givenName','familyName','locale', 'preferences']

  return {
    getProfile: async (user: string) => {
      const { Item: profile } = await client.send(new GetCommand({
        TableName: tableName,
        Key: {
          entity: 'PROFILE',
          id: user
        },
        ProjectionExpression: readAttributes.map(attr => `#${attr}`).join(', '),
        ExpressionAttributeNames: readAttributes.reduce((acc: Record<string, string>, attr) => {
          acc[`#${attr}`] = attr
          return acc
        }, {})
      }))

      if (!profile) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Profile not found',
        })
      }

      return {
        email: user,
        ...profile
      } as Profile
    },
    isRegistered: async (user: string) => {
      const { Item: profile } = await client.send(new GetCommand({
        TableName: tableName,
        Key: {
          entity: 'PROFILE',
          id: user
        },
        ProjectionExpression: 'id',
      }))

      return !!profile
    },
    createProfile: async (user: string, profile: any) => {
      for (const key in profile) {
        if (!writeAttributes.includes(key)) {
          delete profile[key]
        }
      }

      await client.send(new PutCommand({
        TableName: tableName,
        Item: {
          entity: 'PROFILE',
          id: user,
          ...profile
        },
        ConditionExpression: 'attribute_not_exists(id)'
      }))

      return {
        email: user,
        ...profile
      } as Profile
    },
    updateProfile: async (user: string, profile: any) => {
      const expressionAttributeNames = {} as Record<string, string>
      const expressionAttributeValues = {} as Record<string, string>
      const updateExpressionSets = [] as Array<string>
      let updateCount = 0
      
      for (const key in profile) {
        if (!writeAttributes.includes(key)) {
          continue
        }
        const value = profile[key]
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
        updateExpressionSets.push(`#${key} = :${key}`)
        updateCount++
      }

      if (updateCount === 0) {
        throw new Error("Invalid Profile Update");
      }

      await client.send(new UpdateCommand({
        TableName: tableName,
        Key: {
          entity: 'PROFILE',
          id: user,
        },
        UpdateExpression: `SET ${updateExpressionSets.join(', ')}, #updatedAt = :updatedAt`,
        ExpressionAttributeNames: {
          ...expressionAttributeNames,
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
          ':updatedAt': new Date().toISOString(),
        }
      }))
    },
    disableProfile: async (user: string) => {
      await client.send(new UpdateCommand({
        TableName: tableName,
        Key: {
          entity: 'PROFILE',
          id: user,
        },
        UpdateExpression: 'SET #disabled = :disabled',
        ExpressionAttributeNames: {
          '#disabled': 'disabled'
        },
        ExpressionAttributeValues: {
          ':disabled': true
        }
      }))
    }
  }
}
