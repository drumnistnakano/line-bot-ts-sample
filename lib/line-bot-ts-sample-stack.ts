import { Stack, StackProps, Duration } from 'aws-cdk-lib'
import { Function, Runtime, Code, Tracing } from 'aws-cdk-lib/aws-lambda'
import {
  RestApi,
  MethodLoggingLevel,
  LambdaIntegration,
} from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class LineBotTsSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lineEchoBotHandler = new Function(this, 'lineEchoBotHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'lineEchoBot.handler',
      code: Code.fromAsset('lambda'),
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
    })

    const api = new RestApi(this, 'lineEchoBotApi', {
      restApiName: 'lineEchoBotApi',
      deployOptions: {
        tracingEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    })

    const items = api.root.addResource('items')
    items.addMethod('POST', new LambdaIntegration(lineEchoBotHandler))
  }
}
