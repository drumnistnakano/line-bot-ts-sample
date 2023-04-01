import { validateSignature } from '@line/bot-sdk'

interface RequestType {
  requestBody: string | undefined
  headerSignature: string | undefined
  channelSecret: string
}

export const isValidateHeaders = ({
  headerSignature,
  requestBody,
  channelSecret,
}: RequestType): boolean => {
  if (headerSignature == null) {
    console.info('x-line-signatureが空です')
    return false
  }
  if (requestBody == null) {
    console.info('リクエストボディが空です')
    return false
  }

  const isValidSignature = validateSignature(
    requestBody,
    channelSecret,
    headerSignature
  )
  if (!isValidSignature) {
    console.info({
      message: '署名は無効です。',
      headerSignature,
      isValidSignature,
    })
    return false
  }

  console.info({
    message: '署名は有効です。処理を継続します',
    isValidSignature,
  })

  return true
}
