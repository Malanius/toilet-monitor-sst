import * as events from 'aws-cdk-lib/aws-events';
import { EventBus, StackContext } from 'sst/constructs';

export function Events({ stack }: StackContext) {
  const eventBus = new EventBus(stack, 'EventBus', {
    rules: {},
  });

  new events.Archive(stack, 'EventsArchive', {
    eventPattern: {},
    sourceEventBus: eventBus.cdk.eventBus,
  });

  return {
    eventBus,
  };
}
