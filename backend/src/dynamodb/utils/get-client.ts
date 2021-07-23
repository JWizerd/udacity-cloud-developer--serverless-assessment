import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export function createDynamoDBClient() {
  if (process.env.IS_OFFLINE || process.env.JEST_WORKER_ID) {
    console.log('Creating a local DynamoDB instance')
    return new DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new DocumentClient()
}