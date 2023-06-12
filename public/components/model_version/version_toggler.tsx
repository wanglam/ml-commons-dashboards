/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo } from 'react';
import { EuiSuperSelect } from '@elastic/eui';

import { useFetcher } from '../../hooks';
import { APIProvider } from '../../apis/api_provider';

interface VersionTogglerProps {
  modelId: string;
  latestVersion?: number;
  currentVersion: string;
  currentVersionId: string;
  onVersionChange: ({ newVersion, newId }: { newVersion: string; newId: string }) => void;
}

export const VersionToggler = ({
  modelId,
  latestVersion,
  currentVersion,
  currentVersionId,
  onVersionChange,
}: VersionTogglerProps) => {
  const { data: versions } = useFetcher(APIProvider.getAPI('modelVersion').search, {
    modelIds: [modelId],
    from: 0,
    // TODO: Implement scroll bottom load more once version toggler UX confirmed
    size: 50,
  });
  const versionsWithCurrentSelected = useMemo(() => {
    const loadedVersionsData = (versions?.data || []) as Array<{
      model_version: string;
      id: string;
    }>;
    if (loadedVersionsData.find((version) => version.id === currentVersionId)) {
      return loadedVersionsData;
    }
    return loadedVersionsData.concat({
      model_version: currentVersion,
      id: currentVersionId,
    });
  }, [currentVersion, currentVersionId, versions]);

  const options = useMemo(
    () =>
      versionsWithCurrentSelected.map(({ model_version: modelVersion, id }) => ({
        value: id,
        inputDisplay: `v.${modelVersion}`,
        dropdownDisplay:
          modelVersion === `${latestVersion}` ? `v.${modelVersion} (latest)` : `v.${modelVersion}`,
      })),
    [versionsWithCurrentSelected]
  );

  const handleChange = useCallback(
    (value: string) => {
      const newVersion = versionsWithCurrentSelected.find((version) => version.id === value);
      if (newVersion) {
        onVersionChange({ newVersion: newVersion.model_version, newId: newVersion.id });
      }
    },
    [onVersionChange, versionsWithCurrentSelected]
  );

  return (
    <div style={{ width: 120 }}>
      <EuiSuperSelect
        options={options}
        onChange={handleChange}
        valueOfSelected={currentVersionId}
      />
    </div>
  );
};
