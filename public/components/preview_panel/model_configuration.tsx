/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiCodeBlock, EuiSpacer, EuiTitle } from '@elastic/eui';
import { APIProvider } from '../../apis/api_provider';
import { useFetcher } from '../../hooks';

export const ModelConfiguration = ({ id }: { id: string }) => {
  const { data } = useFetcher(APIProvider.getAPI('model').getOne, id);
  return (
    <>
      <EuiTitle size="xxs">
        <h5>Model Configuration</h5>
      </EuiTitle>
      <EuiSpacer size="s" />
      {data?.model_config && (
        <EuiCodeBlock language="json" whiteSpace="pre">
          {JSON.stringify(data.model_config, null, 4)}
        </EuiCodeBlock>
      )}
      <EuiSpacer />
    </>
  );
};
