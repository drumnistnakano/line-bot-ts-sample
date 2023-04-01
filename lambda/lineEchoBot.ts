import * as line from '@line/bot-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { isValidateHeaders } from './util/validateRequest'

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET',
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.debug(event)
  try {
    const isValidHeaders = isValidateHeaders({
      headerSignature: event.headers['x-line-signature'],
      requestBody: event.body ?? undefined,
      channelSecret: config.channelSecret,
    })
    if (!isValidHeaders) {
      return {
        statusCode: 403,
        body: 'リクエストヘッダーエラー',
      }
    }

    // replyMessage API叩く
    const client = new line.Client(config)
    return {
      statusCode: 200,
      body: 'Hello Wolrd!',
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}
