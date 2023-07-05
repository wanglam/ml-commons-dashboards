/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiLink, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import { ModelAccessControlField } from '../common/forms/model_access_control_field';

export const ModelAccessControl = () => {
  return (
    <>
      <EuiTitle size="s">
        <h3>Access control</h3>
      </EuiTitle>
      <EuiSpacer size="xs" />
      <EuiText>
        Limit access to all versions of this model based on access level and backend roles.
        <EuiLink external>Learn more</EuiLink>
      </EuiText>
      <EuiSpacer size="m" />
      <ModelAccessControlField />
    </>
  );
};
