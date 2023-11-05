import { Entity } from 'electrodb';
import { Table } from 'sst/node/table';

import { getDdbClient } from '../client';

export const Toilet = new Entity(
  {
    model: {
      entity: 'toilet',
      service: 'status',
      version: '1',
    },
    attributes: {
      toiletId: {
        type: 'string',
      },
      toiletName: {
        type: 'string',
      },
      toiletStatus: {
        type: ['FREE', 'OCCUIPED', 'OUT_OF_ORDER'] as const,
      },
    },
    indexes: {
      byId: {
        pk: {
          field: 'pk',
          composite: ['toiletId'],
        },
        sk: {
          field: 'sk',
          composite: ['toiletName'],
        },
      },
      byName: {
        index: 'GSI1',
        pk: {
          field: 'gsi1pk',
          composite: ['toiletName'],
        },
        sk: {
          field: 'gsi1sk',
          composite: ['toiletId'],
        },
      },
    },
  },
  { client: getDdbClient(), table: Table.AllTable.tableName }
);
