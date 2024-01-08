import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import type { IoTEvent } from 'aws-lambda';

import { logger, tracer } from '../powertools';

const main: IoTEvent<any> = async (_event) => {};

export const handler = middy(main)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { clearState: true }));
