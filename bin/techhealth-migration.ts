!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { TechHealthCdkStack } from '../lib/techhealth-cdk-stack';

const app = new cdk.App();

new TechHealthCdkStack(app, 'TechHealthInfrastructureStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-2',
  },
});
