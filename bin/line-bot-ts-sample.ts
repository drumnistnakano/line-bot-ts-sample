#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { LineBotTsSampleStack } from '../lib/line-bot-ts-sample-stack'

const app = new cdk.App()
new LineBotTsSampleStack(app, 'LineBotTsSampleStack')
