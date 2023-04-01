import * as line from '@line/bot-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event)
  const client = new line.Client(config)
  return {
    statusCode: 200,
    body: 'Hello Wolrd!',
  }
}
