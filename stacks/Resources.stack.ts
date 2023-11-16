import { RemovalPolicy } from 'aws-cdk-lib';
import { ApiKey, UsagePlan } from 'aws-cdk-lib/aws-apigateway';
import { Config, StackContext, Table } from 'sst/constructs';

export function Resources({ stack }: StackContext) {
  const database = new Table(stack, 'Database', {
    fields: {
      pk: 'string',
      sk: 'string',
      gsi1pk: 'string',
      gsi1sk: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    globalIndexes: {
      GSI1: {
        partitionKey: 'gsi1pk',
        sortKey: 'gsi1sk',
      },
    },
    cdk: {
      table: {
        deletionProtection: stack.stage === 'prod',
        removalPolicy:
          stack.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      },
    },
  });

  const usagePlan = new UsagePlan(stack, 'UsagePlan', {});
  const USAGE_PLAN_ID = new Config.Parameter(stack, 'UsagePlanId', {
    value: usagePlan.usagePlanId,
  });

  const adminApiKey = new ApiKey(stack, 'AdminApiKey', {
    description: 'Toilet Monitor Admin API Key',
  });
  usagePlan.addApiKey(adminApiKey);
  const ADMIN_API_KEY_ID = new Config.Parameter(stack, 'AdminApiKeyId', {
    value: adminApiKey.keyId,
  });

  return {
    database,
    usagePlan,
    USAGE_PLAN_ID,
    adminApiKey,
    ADMIN_API_KEY_ID,
  };
}
