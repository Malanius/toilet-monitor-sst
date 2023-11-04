import { MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1Api, StackContext } from 'sst/constructs';

export function ApiStack({ app, stack }: StackContext) {
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

  const plan = api.cdk.restApi.addUsagePlan('UsagePlan', {
    description: 'Toilet Monitor usage plan',
    apiStages: [
      { api: api.cdk.restApi, stage: api.cdk.restApi.deploymentStage },
    ],
  });
  plan.addApiKey(api.cdk.restApi.addApiKey('TestApiKey'));

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}
