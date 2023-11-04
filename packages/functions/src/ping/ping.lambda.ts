import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import type { APIGatewayProxyHandler } from 'aws-lambda';

import { logger, tracer } from '../powertools';

const main: APIGatewayProxyHandler = async (event) => {
  const callingId = event.requestContext?.identity?.apiKeyId;
  logger.info(`Pinged from ${callingId}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello device ${callingId}` }),
  };
};

export const handler = middy(main)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { clearState: true }));
