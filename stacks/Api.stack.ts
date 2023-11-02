import { Duration } from 'aws-cdk-lib';
import { MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1Api, StackContext } from 'sst/constructs';

export function ApiStack({ app, stack }: StackContext) {
  const api = new ApiGatewayV1Api(stack, 'Api', {
    defaults: {
      function: {
        environment: {
          APP_ENV: app.stage,
          APP_NAME: app.name,
          LOG_LEVEL: app.stage === 'prod' ? 'WARN' : 'DEBUG',
          POWERTOOLS_LOGGER_LOG_EVENT: app.stage === 'prod' ? 'false' : 'true',
          POWERTOOLS_PARAMETERS_MAX_AGE: Duration.minutes(5)
            .toSeconds()
            .toString(),
        },
      },
    },
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
