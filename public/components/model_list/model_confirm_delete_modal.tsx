/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { EuiConfirmModal } from '@elastic/eui';
import { APIProvider } from '../../apis/api_provider';
import { usePollingUntil } from '../../hooks/use_polling_until';

export class NoIdProvideError {}

export interface ModelConfirmDeleteModalInstance {
  show: (modelId: string) => void;
}

export const ModelConfirmDeleteModal = React.forwardRef<
  ModelConfirmDeleteModalInstance,
  { onDeleted: () => void }
>(({ onDeleted }, ref) => {
  const deleteIdRef = useRef<string>();
  const [visible, setVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { start: startPolling } = usePollingUntil({
    continueChecker: async () => {
      if (!deleteIdRef.current) {
        throw new NoIdProvideError();
      }
      return (
        (
          await APIProvider.getAPI('modelVersion').search({
            ids: [deleteIdRef.current],
            from: 0,
            size: 1,
          })
        ).total_model_versions === 1
      );
    },
    onGiveUp: () => {
      setIsDeleting(false);
      setVisible(false);
      onDeleted();
    },
    onMaxRetries: () => {
      setIsDeleting(false);
      setVisible(false);
    },
  });

  const handleConfirm = useCallback(
    async (e) => {
      if (!deleteIdRef.current) {
        throw new NoIdProvideError();
      }
      e.stopPropagation();
      setIsDeleting(true);
      await APIProvider.getAPI('modelVersion').delete(deleteIdRef.current);
      startPolling();
    },
    [startPolling]
  );

  const handleCancel = useCallback(() => {
    setVisible(false);
    deleteIdRef.current = undefined;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (id: string) => {
        deleteIdRef.current = id;
        setVisible(true);
      },
    }),
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <EuiConfirmModal
      title="Are you sure delete this model?"
      cancelButtonText="Cancel"
      confirmButtonText="Confirm"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isLoading={isDeleting}
    />
  );
});
