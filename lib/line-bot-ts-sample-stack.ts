import { Stack, StackProps, Duration } from 'aws-cdk-lib'
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import {
  RestApi,
  MethodLoggingLevel,
  LambdaIntegration,
} from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class LineBotTsSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lineEchoBotHandler = new NodejsFunction(this, 'lineEchoBotHandler', {
      runtime: Runtime.NODEJS_18_X,
      entry: 'lambda/lineEchoBot.ts',
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: {
        CHANNEL_ACCESS_TOKEN: process.env.CHANNEL_ACCESS_TOKEN ?? '',
        CHANNEL_SECRET: process.env.CHANNEL_SECRET ?? '',
      },
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
