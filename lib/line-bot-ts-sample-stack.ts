import { Stack, StackProps } from 'aws-cdk-lib'
import { Function, Runtime, Code, Tracing } from 'aws-cdk-lib/aws-lambda'
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class LineBotTsSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lambda = new Function(this, 'lineBotFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'lineEchoBot.handler',
      code: Code.fromAsset('lambda'),
      tracing: Tracing.ACTIVE,
    })

    const api = new RestApi(this, 'lineEchoBotApi', {
      restApiName: 'lineEchoBotApi',
      deployOptions: {
        tracingEnabled: true,
      },
    })
  }
}
