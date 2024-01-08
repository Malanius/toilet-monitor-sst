import { Duration } from 'aws-cdk-lib';
import { LambdaInsightsVersion } from 'aws-cdk-lib/aws-lambda';
import type { SSTConfig } from 'sst';

import { Events } from './stacks/Events.stack';
import { IoT } from './stacks/IoT.stack';
import { Resources } from './stacks/Resources.stack';

export default {
  config(_input) {
    return {
      name: 'toilet-monitor',
      region: 'eu-west-1',
    };
  },
  stacks(app) {
    const isProd = app.stage === 'prod';
    if (!isProd) {
      app.setDefaultRemovalPolicy('destroy');
    }

    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      architecture: 'arm_64',
      memorySize: 128,
      logRetention: 'three_months',
      insightsVersion: LambdaInsightsVersion.VERSION_1_0_229_0,
      environment: {
        APP_ENV: app.stage,
        APP_NAME: app.name,
        LOG_LEVEL: isProd ? 'INFO' : 'DEBUG',
        POWERTOOLS_LOGGER_LOG_EVENT: isProd ? 'false' : 'true',
        POWERTOOLS_PARAMETERS_MAX_AGE: Duration.minutes(5)
          .toSeconds()
          .toString(),
      },
    });

    app.stack(Resources).stack(Events).stack(IoT);
  },
} satisfies SSTConfig;
