import {
  Client,
  WebhookRequestBody,
  WebhookEvent,
  MessageAPIResponseBase,
} from '@line/bot-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { isValidateHeaders } from './util/validateRequest'

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET',
}

const client = new Client(config)

const processWebhookEvent = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | null> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  })
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

    const webhookRequestBody: WebhookRequestBody = JSON.parse(event.body!)
    const { events } = webhookRequestBody
    const results = await Promise.allSettled(
      events.map(async (event) => processWebhookEvent(event as WebhookEvent))
    )

    const rejectedStatus = results.filter(
      (result) => result.status == 'rejected'
    )
    if (rejectedStatus.length > 0) {
      throw new Error('replyMessageに失敗しました')
    }

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
