import type { SSTConfig } from 'sst';

import { ApiStack } from './stacks/Api';

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

    app.stack(ApiStack);
  },
} satisfies SSTConfig;
