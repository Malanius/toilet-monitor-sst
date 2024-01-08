import * as iotActions from '@aws-cdk/aws-iot-actions-alpha';
import * as iot from '@aws-cdk/aws-iot-alpha';
import { Function, Queue, StackContext } from 'sst/constructs';

export function IoT({ app, stack }: StackContext) {
  const iotFunction = new Function(stack, 'IoTFunction', {
    handler: 'packages/functions/src/iot/iot.lambda.handler',
  });

  const iotDlq = new Queue(stack, 'IoTDlq', {});

  new iot.TopicRule(stack, 'TopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      `SELECT * FROM '${app.name}/${app.stage}/status'`
    ),
    actions: [new iotActions.LambdaFunctionAction(iotFunction)],
    errorAction: new iotActions.SqsQueueAction(iotDlq.cdk.queue, {
      useBase64: false,
    }),
  });
}
