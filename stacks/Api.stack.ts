import { MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { Resources } from './Resources.stack';

export function Api({ app, stack }: StackContext) {
  const { usagePlan } = use(Resources);
  const api = new ApiGatewayV1Api(stack, 'Api', {
    cdk: {
      restApi: {
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
        },
        deployOptions: {
          loggingLevel: MethodLoggingLevel.INFO,
        },
      },
    },
    routes: {
      'GET /ping': {
        function: {
          handler: 'packages/functions/src/ping/ping.lambda.handler',
          environment: {
            POWERTOOLS_SERVICE_NAME: 'ping',
          },
        },
        cdk: {
          method: {
            apiKeyRequired: true,
          },
        },
      },
    },
  });

  usagePlan.addApiStage({
    stage: api.cdk.restApi.deploymentStage,
  });

  // Return the API resource
  return {
    api,
  };
}
