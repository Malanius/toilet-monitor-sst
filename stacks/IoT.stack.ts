import * as iotAlphaActions from '@aws-cdk/aws-iot-actions-alpha';
import * as iotAlpha from '@aws-cdk/aws-iot-alpha';
import * as iot from 'aws-cdk-lib/aws-iot';
import { Function, Queue, StackContext } from 'sst/constructs';

export function IoT({ app, stack }: StackContext) {
  const iotFunction = new Function(stack, 'IoTFunction', {
    handler: 'packages/functions/src/iot/iot.lambda.handler',
  });

  const iotDlq = new Queue(stack, 'IoTDlq', {});

  const topicName = `${app.name}/${app.stage}/status`;
  new iotAlpha.TopicRule(stack, 'TopicRule', {
    sql: iotAlpha.IotSql.fromStringAsVer20160323(
      `SELECT * FROM '${topicName}'`
    ),
    actions: [new iotAlphaActions.LambdaFunctionAction(iotFunction)],
    errorAction: new iotAlphaActions.SqsQueueAction(iotDlq.cdk.queue, {
      useBase64: false,
    }),
  });

  new iot.CfnPolicy(stack, 'Policy', {
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'iot:Connect',
          Resource: `arn:aws:iot:${stack.region}:${stack.account}:client/ToiletClient`,
        },
        {
          Effect: 'Allow',
          Action: 'iot:Publish',
          Resource: `arn:aws:iot:${stack.region}:${stack.account}:topic/${topicName}`,
        },
      ],
    },
  });
}
