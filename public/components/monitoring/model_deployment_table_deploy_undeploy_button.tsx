/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { EuiButtonIcon, EuiToolTip } from '@elastic/eui';

import { MODEL_STATE } from '../../../common';
import { ModelVersionDeploymentConfirmModal } from '../common/modals';

export const ModelDeploymentTableDeployUndeployButton = ({
  id,
  name,
  state,
  version,
  onDeployed,
  onUndeployed,
}: {
  id: string;
  name: string;
  state: MODEL_STATE;
  version: string;
  onDeployed: (id: string) => void;
  onUndeployed: (id: string) => void;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const mode = state === MODEL_STATE.loaded ? 'undeploy' : 'deploy';

  const handleButtonClick = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(
    ({ succeed, id: modelVersionId }: { canceled: boolean; succeed: boolean; id: string }) => {
      setIsModalVisible(false);
      if (succeed) {
        (mode === 'deploy' ? onDeployed : onUndeployed)(modelVersionId);
      }
    },
    [onDeployed, onUndeployed, mode]
  );

  return (
    <>
      <EuiToolTip content={`${mode} model`}>
        <EuiButtonIcon
          role="button"
          aria-label={`${mode} model`}
          iconType={mode === 'deploy' ? 'exportAction' : 'importAction'}
          onClick={handleButtonClick}
        />
      </EuiToolTip>
      {isModalVisible && (
        <ModelVersionDeploymentConfirmModal
          id={id}
          name={name}
          mode={mode}
          version={version}
          closeModal={handleCloseModal}
        />
      )}
    </>
  );
};
