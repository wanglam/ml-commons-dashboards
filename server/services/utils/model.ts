/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MODEL_STATE } from '../../../common';
import { generateTermQuery } from './query';

export const generateModelSearchQuery = ({
  states,
  nameOrId,
  ids,
}: {
  states?: MODEL_STATE[];
  nameOrId?: string;
  ids?: string[];
}) => ({
  bool: {
    must: [
      ...(ids ? [{ ids: { values: ids } }] : []),
      ...(states ? [generateTermQuery('model_state', states)] : []),
      ...(nameOrId
        ? [
            {
              bool: {
                should: [
                  {
                    wildcard: {
                      'name.keyword': { value: `*${nameOrId}*`, case_insensitive: true },
                    },
                  },
                  generateTermQuery('_id', nameOrId),
                ],
              },
            },
          ]
        : []),
    ],
    must_not: {
      exists: {
        field: 'chunk_number',
      },
    },
  },
});
