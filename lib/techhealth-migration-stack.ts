import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';

export class TechHealthCdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // =========================================================
    // VPC
    // =========================================================

    const vpc = new ec2.Vpc(this, 'TechHealthVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),

      maxAzs: 2,

      natGateways: 0,

      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // =========================================================
    // EC2 SECURITY GROUP
    // =========================================================

    const ec2SecurityGroup = new ec2.SecurityGroup(
      this,
      'EC2SecurityGroup',
      {
        vpc: vpc,

        description:
          'Security group for TechHealth patient portal EC2 instance',

        allowAllOutbound: true,
      }
    );

    // =========================================================
    // RDS SECURITY GROUP
    // =========================================================

    const rdsSecurityGroup = new ec2.SecurityGroup(
      this,
      'RDSSecurityGroup',
      {
        vpc: vpc,

        description:
          'Security group for TechHealth PostgreSQL database',

        allowAllOutbound: true,
      }
    );

    // Allow EC2 to communicate with PostgreSQL.
    rdsSecurityGroup.addIngressRule(
      ec2SecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL traffic from EC2'
    );

    // =========================================================
    // EC2 IAM ROLE
    // =========================================================

    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal(
        'ec2.amazonaws.com'
      ),

      description:
        'IAM role for TechHealth patient portal EC2 instance',

      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore'
        ),
      ],
    });

    // =========================================================
    // EC2 INSTANCE
    // =========================================================

    const ec2Instance = new ec2.Instance(
      this,
      'TechHealthEC2Instance',
      {
        vpc: vpc,

        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },

        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO
        ),

        machineImage:
          ec2.MachineImage.latestAmazonLinux2023(),

        securityGroup: ec2SecurityGroup,

        role: ec2Role,

        requireImdsv2: true,

        associatePublicIpAddress: true,
      }
    );

    // =========================================================
    // RDS POSTGRESQL DATABASE
    // =========================================================

    const database = new rds.DatabaseInstance(
      this,
      'TechHealthDatabase',
      {
        engine: rds.DatabaseInstanceEngine.postgres({
          version:
            rds.PostgresEngineVersion.VER_16,
        }),

        vpc: vpc,

        vpcSubnets: {
          subnetType:
            ec2.SubnetType.PRIVATE_ISOLATED,
        },

        securityGroups: [
          rdsSecurityGroup,
        ],

        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO
        ),

        allocatedStorage: 20,

        maxAllocatedStorage: 100,

        databaseName: 'techhealth',

        credentials:
          rds.Credentials.fromGeneratedSecret(
            'postgres'
          ),

        publiclyAccessible: false,

        multiAz: false,

        backupRetention:
          cdk.Duration.days(7),

        deletionProtection: false,

        removalPolicy:
          cdk.RemovalPolicy.SNAPSHOT,
      }
    );

    // =========================================================
    // CLOUDFORMATION OUTPUTS
    // =========================================================

    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      description:
        'TechHealth VPC ID',
    });

    new cdk.CfnOutput(this, 'EC2InstanceId', {
      value: ec2Instance.instanceId,
      description:
        'TechHealth EC2 Instance ID',
    });

    new cdk.CfnOutput(this, 'EC2PublicIP', {
      value: ec2Instance.instancePublicIp,
      description:
        'TechHealth EC2 Public IP',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value:
        database.dbInstanceEndpointAddress,
      description:
        'TechHealth RDS endpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value:
        database.dbInstanceEndpointPort,
      description:
        'TechHealth RDS port',
    });
  }
}
