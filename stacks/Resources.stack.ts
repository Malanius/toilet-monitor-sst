import { RemovalPolicy } from 'aws-cdk-lib';
import { StackContext, Table } from 'sst/constructs';

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

  return {
    database,
  };
}
