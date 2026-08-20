import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { TechHealthCdkStack } from '../lib/techhealth-cdk-stack';

test('TechHealth VPC is created', () => {
  const app = new cdk.App();

  const stack = new TechHealthCdkStack(
    app,
    'TestStack'
  );

  const template = Template.fromStack(stack);

  template.resourceCountIs(
    'AWS::EC2::VPC',
    1
  );
});

test('TechHealth creates an EC2 instance', () => {
  const app = new cdk.App();

  const stack = new TechHealthCdkStack(
    app,
    'TestStack'
  );

  const template = Template.fromStack(stack);

  template.resourceCountIs(
    'AWS::EC2::Instance',
    1
  );
});

test('TechHealth creates an RDS database', () => {
  const app = new cdk.App();

  const stack = new TechHealthCdkStack(
    app,
    'TestStack'
  );

  const template = Template.fromStack(stack);

  template.resourceCountIs(
    'AWS::RDS::DBInstance',
    1
  );
});
