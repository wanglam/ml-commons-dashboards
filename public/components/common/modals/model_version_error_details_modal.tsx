/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import {
  EuiModal,
  EuiModalHeader,
  EuiModalBody,
  EuiModalHeaderTitle,
  EuiModalFooter,
  EuiTitle,
  EuiButtonEmpty,
  EuiText,
  EuiCodeBlock,
  EuiSpacer,
} from '@elastic/eui';

const errorType2ErrorTitleMap = {
  'deployment-failed': 'deployment failed',
  'artifact-upload-failed': 'artifact upload failed',
  'undeployment-failed': 'undeployment failed',
};

export const ModelVersionErrorDetailsModal = ({
  name,
  version,
  errorType,
  closeModal,
  errorDetails,
}: {
  id: string;
  name: string;
  version: string;
  errorType: 'deployment-failed' | 'artifact-upload-failed' | 'undeployment-failed';
  closeModal: () => void;
  errorDetails: string;
  plainVersionLink?: string;
}) => {
  const errorTitle = errorType2ErrorTitleMap[errorType];
  const linkText = `${name} version ${version}`;

  return (
    <EuiModal style={{ width: 520 }} onClose={closeModal}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <EuiTitle>
            <h2>
              {linkText} {errorTitle}
            </h2>
          </EuiTitle>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        {errorType === 'deployment-failed' || errorType === 'undeployment-failed' ? (
          <>
            <EuiText size="s">Error message:</EuiText>
            <EuiSpacer size="m" />
            <EuiCodeBlock isCopyable={true}>{errorDetails}</EuiCodeBlock>
          </>
        ) : (
          <EuiText style={{ padding: '8px 0' }} size="s">
            <p style={{ wordBreak: 'break-all' }}>{errorDetails}</p>
          </EuiText>
        )}
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={closeModal}>Close</EuiButtonEmpty>
      </EuiModalFooter>
    </EuiModal>
  );
};
