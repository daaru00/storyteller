import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { GoogleGenAI } from "@google/genai";

const ddbClient = new DynamoDBClient({ region: "eu-west-1", profile: "personal" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({ region: "eu-west-1", profile: "personal" });
const ai = new GoogleGenAI({});

async function listBooks() {
  try {
    const data = await ddbDocClient.send(new QueryCommand({
      TableName: "storyteller",
      KeyConditionExpression: "entity = :entity",
      ExpressionAttributeValues: {
        ":entity": "BOOK"
      }
    }));
    return data.Items || [];
  } catch (err) {
    console.error("Error", err);
  }
}

async function generateImage(book) {
  console.log(`Generating image for book "${book.title.en}"...`);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: `Generate an image for the book cover, never include the title (or any other text label), do not use real existing books as references. Title "${book.title.en}", Genre: ${book.genre}, Summary: ${book.summary.en}.`,
    config: {
      imageConfig: {
        aspectRatio: "9:16"
      }
    }
  });

  const outputpath = `media/book/${book.id}/cover.png`;

  if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content.parts) {
    console.error(`No image generated for book "${book.title.en}"`);
    return;
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      await s3Client.send(new PutObjectCommand({
        Bucket: "storyteller-eu-west-1-media",
        Key: outputpath,
        Body: buffer
      }));
      console.log(`Image saved as https://storyteller.daaru.dev/${outputpath}`);
    }
  }

  return `https://storyteller.daaru.dev/${outputpath}`;
}

async function saveImageUrl(book, imageUrl) {
  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: "storyteller",
      Key: {
        entity: "BOOK",
        id: book.id,
      },
      UpdateExpression: "set imageUrl = :imageUrl",
      ExpressionAttributeValues: {
        ":imageUrl": imageUrl
      }
    }));
    console.log(`Image URL saved for book "${book.title.en}": ${imageUrl}`);
  } catch (err) {
    console.error("Error", err);
  }
}

async function main() {
  const books = await listBooks();
  for (const book of books) {
    const url = await generateImage(book);
    await saveImageUrl(book, url);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

main();
