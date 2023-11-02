import type { SSTConfig } from 'sst';

import { ApiStack } from './stacks/Api.stack';

export default {
  config(_input) {
    return {
      name: 'toilet-monitor',
      region: 'eu-west-1',
    };
  },
  stacks(app) {
    if (app.stage !== 'prod') {
      app.setDefaultRemovalPolicy('destroy');
    }

    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      architecture: 'arm_64',
      logRetention: 'three_months',
    });

    app.stack(ApiStack);
  },
} satisfies SSTConfig;
