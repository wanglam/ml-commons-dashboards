/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { EuiTitle, EuiSpacer, EuiRadioGroup, EuiText, EuiTextColor } from '@elastic/eui';

export const ModelAccessControlField = () => {
  const options = useMemo(
    () => [
      {
        id: 'private',
        label: (
          <EuiText>
            Private{' '}
            <EuiTextColor color="subdued">
              – accessible by you and your administrators only
            </EuiTextColor>
          </EuiText>
        ),
      },
      {
        id: 'restricted',
        label: (
          <EuiText>
            Restricted{' '}
            <EuiTextColor color="subdued">
              – accessible by users with specific backend roles
            </EuiTextColor>
          </EuiText>
        ),
      },
      {
        id: 'everyone',
        label: (
          <EuiText>
            Everyone{' '}
            <EuiTextColor color="subdued">– accessible by all users on this cluster</EuiTextColor>
          </EuiText>
        ),
      },
    ],
    []
  );
  return (
    <>
      <EuiTitle size="xs">
        <h4>Access level</h4>
      </EuiTitle>
      <EuiSpacer size="xs" />
      <EuiRadioGroup options={options} onChange={() => {}} />
    </>
  );
};
