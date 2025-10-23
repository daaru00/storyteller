import { QueryCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from "crypto"

export default function() {
  const { client: db, tableName } = useDynamoDB()
  const readAttributes = ['id', 'text', 'imageUrl', 'choices', 'book']
  const { generateJson, generateImage } = useGemini()
  const { client: s3, bucketName, publicUrl } = useS3()

  return {
    listReadings: async (userId: string, nextToken?: string) => {
      const { Items: readings, LastEvaluatedKey } = await db.send(new QueryCommand({
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
        readings: (readings || []).map(readings => ({...readings, id: readings.id.split('#')[1] })) as Reading[],
        nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : undefined
      } as { readings: Reading[], nextToken?: string }
    },
    getReading: async (userId: string, readingId: string) => {
      let { Item: reading } = await db.send(new GetCommand({
        TableName: tableName,
        Key: {
          entity: 'READ',
          id: userId + '#' + readingId
        },
        ProjectionExpression: readAttributes.map(attr => `#${attr}`).join(', '),
        ExpressionAttributeNames: readAttributes.reduce((acc: Record<string, string>, attr) => {
          acc[`#${attr}`] = attr
          return acc
        }, {}),
      }))

      if (!reading) {
        throw new Error('Reading not found')
      }

      reading.id = readingId
      return reading as Reading
    },
    createReading: async (userId: string, book: Book, locale: string) => {
      const uuid = crypto.randomUUID()

      const prompt = `
        You write a story based on the choice made by the reader. The story title is "${book.title}" and the genre is "${book.genre}".
        The story prompt is: ${book.summary.en}.
        Generate the very first paragraph of the story. The story will be interactive, so end the paragraph with a situation that requires the reader to make a choice.
        Respond with a JSON object with two fields: "text" containing the next part of the story, and "choices" containing a list of 3 possible next choices.
        The generated content for "text" and "choices" must be in locale "${locale}".
      `

      const response = await generateJson<{ text: string, choices: string[] }>(prompt, {
        type: "object",
        properties: {
          text: { type: "string" },
          choices: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3
          }
        },
        required: ["text", "choices"]
      })

      const image = await generateImage(
        `
          Create an evocative and atmospheric illustration for the following story paragraph: "${response.text}". 
          The style should match the genre of the story: "${book.genre}".
          Do not include any text or labels in the image.
        `,
        {
          aspectRatio: "9:16"
        }
      )

      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `media/${userId}/readings/${uuid}.png`,
        Body: image
      }));

      const reading: Reading = {
        id: uuid,
        book,
        text: response.text,
        imageUrl: publicUrl + `/${userId}/readings/${uuid}.png`,
        choices: response.choices
      }

      await db.send(new PutCommand({
        TableName: tableName,
        Item: {
          ...reading,
          entity: 'READ',
          id: userId + '#' + uuid,
        }
      }))

      return reading
    },
    getHistory: async (userId: string, readingId: string) => {
      try {
        const { Body: body } = await s3.send(new GetObjectCommand({
          Bucket: bucketName,
          Key: `readings/${userId}/${readingId}.txt`
        }))
        return await body?.transformToString()
      } catch (error) {
        return ''
      }
    },
    updateHistory: async (userId: string, readingId: string, content: string) => {
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `readings/${userId}/${readingId}.txt`,
        Body: content
      }))
    },
    generateNext: async (userId: string, reading: Reading, history: string, choice: string, locale: string) => {
      const prompt = `
        You write a story based on the choice made by the reader. The story title is "${reading.book.title}" and the genre is "${reading.book.genre}".
        The story prompt is: ${reading.book.summary.en}.
        Here the story so far:
        ---
        ${history}
        ---
        The reader made the choice: "${choice}".
        Continue the story with a new paragraph, keeping the same style and tone. The story will be interactive, so end the paragraph with a situation that requires the reader to make a choice.
        Respond with a JSON object with two fields: "text" containing the next part of the story, and "choices" containing a list of 3 possible next choices.
        The generated content for "text" and "choices" must be in locale "${locale}".
      `
      const response = await generateJson<{ text: string, choices: string[] }>(prompt, {
        type: "object",
        properties: {
          text: { type: "string" },
          choices: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 3
          }
        },
        required: ["text", "choices"]
      })

      const image = await generateImage(
        `
          Create an evocative and atmospheric illustration for the following story paragraph: "${response.text}". 
          The style should match the genre of the story: "${reading.book.genre}".
          Do not include any text or labels in the image.
        `,
        {
          aspectRatio: "9:16"
        }
      )

      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: `media/${userId}/readings/${reading.id}.png`,
        Body: image
      }));

      const cacheBusterParam = '?t=' + Date.now();

      await db.send(new UpdateCommand({
        TableName: tableName,
        Key: {
          entity: 'READ',
          id: userId + '#' + reading.id
        },
        UpdateExpression: 'SET #text = :text, #imageUrl = :imageUrl, #choices = :choices',
        ExpressionAttributeValues: {
          ':text': response.text,
          ':imageUrl': publicUrl + `/${userId}/readings/${reading.id}.png${cacheBusterParam}`,
          ':choices': response.choices
        },
        ExpressionAttributeNames: {
          '#text': 'text',
          '#imageUrl': 'imageUrl',
          '#choices': 'choices'
        }
      }))

      return {
        text: response.text,
        imageUrl: publicUrl + `/${userId}/readings/${reading.id}.png${cacheBusterParam}`,
        choices: response.choices
      }
    },
  }
}
