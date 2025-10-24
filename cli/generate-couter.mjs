import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: "eu-west-1", profile: "personal" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

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

async function setCounter(book, counter) {
  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: "storyteller",
      Key: {
        entity: "BOOK",
        id: book.id,
      },
      UpdateExpression: "set #counter = :counter",
      ExpressionAttributeValues: {
        ":counter": counter
      },
      ExpressionAttributeNames: {
        "#counter": "counter"
      },
    }));
    console.log(`Counter set for book "${book.title.en}": ${counter}`);
  } catch (err) {
    console.error("Error", err);
  }
}

async function main() {
  const books = await listBooks();
  for (const book of books) {
    let counter = 100
    switch (book.genre) {
      case "kids":
        counter = 20
        break;
      case "adventure":
        counter = 200
        break;
      case "fantasy":
        counter = 150
        break;
      case "sci-fi":
        counter = 200
        break;
      case "horror":
        counter = 150
        break;
    }
    await setCounter(book, counter);
  }
}

main();
