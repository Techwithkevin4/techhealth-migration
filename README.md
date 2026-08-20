# TechHealth AWS Infrastructure Migration

## Overview

This project modernizes TechHealth Inc.'s legacy AWS patient portal infrastructure by migrating manually configured AWS resources to Infrastructure as Code using AWS CDK and TypeScript.

<img width="1536" height="1024" alt="TechHealth Inc  1" src="https://github.com/user-attachments/assets/dca6b620-499f-4298-8564-0c547c6a97cd" />


## Objectives

- Implement AWS infrastructure using Infrastructure as Code
- Create a highly available VPC across two Availability Zones
- Deploy EC2 instances in public subnets
- Deploy an Amazon RDS MySQL database in private subnets
- Implement security groups to control application and database traffic
- Configure appropriate IAM roles and policies
- Enable reproducible infrastructure deployments
- Establish a foundation for automated infrastructure testing

## AWS Services

- AWS CDK
- Amazon VPC
- Amazon EC2
- Amazon RDS for MySQL
- AWS IAM
- AWS Secrets Manager
- AWS CloudFormation

## Architecture

The target architecture separates the application and database tiers.

Internet traffic reaches the EC2 application tier through the public subnets. The RDS MySQL database is deployed in private subnets and accepts database connections only from the EC2 security group.

## Project Status

Infrastructure implementation in progress.
