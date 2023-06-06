/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  EuiButton,
  EuiPageHeader,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiPanel,
  EuiLoadingContent,
  EuiTabbedContent,
} from '@elastic/eui';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { MODEL_VERSION_STATE, routerPaths } from '../../../common';
import { useFetcher } from '../../hooks';
import { APIProvider } from '../../apis/api_provider';

import { VersionToggler } from './version_toggler';
import { ModelVersionCallout } from './version_callout';
import { ModelVersionDetails } from './version_details';
import { ModelVersionInformation } from './version_information';
import { ModelVersionArtifact } from './version_artifact';
import { ModelVersionTags } from './version_tags';
import { ModelVersionFormData } from './types';

export const ModelVersion = () => {
  const { id: modelId } = useParams<{ id: string }>();
  const { data: model, loading } = useFetcher(APIProvider.getAPI('modelVersion').getOne, modelId);
  const [modelInfo, setModelInfo] = useState<{ version: string; name: string }>();
  const history = useHistory();
  const modelName = model?.name;
  const modelVersion = model?.model_version;
  const form = useForm<ModelVersionFormData>();

  const onVersionChange = useCallback(
    ({ newVersion, newId }: { newVersion: string; newId: string }) => {
      setModelInfo((prevModelInfo) =>
        prevModelInfo ? { ...prevModelInfo, version: newVersion } : prevModelInfo
      );
      history.push(generatePath(routerPaths.modelVersion, { id: newId }));
    },
    [history]
  );

  useEffect(() => {
    if (!modelName || !modelVersion) {
      return;
    }
    setModelInfo((prevModelInfo) => {
      if (prevModelInfo?.name === modelName && prevModelInfo?.version === modelVersion) {
        return prevModelInfo;
      }
      return {
        name: modelName,
        version: modelVersion,
      };
    });
  }, [modelName, modelVersion]);

  useEffect(() => {
    if (model) {
      form.reset({
        versionNotes: 'TODO', // TODO: read from model.versionNotes
        tags: [
          { key: 'Accuracy', value: '0.85', type: 'number' as const },
          { key: 'Precision', value: '0.64', type: 'number' as const },
          { key: 'Task', value: 'Image classification', type: 'string' as const },
        ], // TODO: read from model.tags
        configuration: JSON.stringify(model.model_config, undefined, 2),
        modelFileFormat: model.model_format,
        // TODO: read model url or model filename
        artifactSource: 'source_not_changed',
        // modelFile: new File([], 'artifact.zip'),
        modelURL: 'http://url.to/artifact.zip',
      });
    }
  }, [model, form]);

  const tabs = [
    {
      id: 'version-information',
      name: 'Version information',
      content: loading ? (
        <>
          <EuiSpacer size="m" />
          <EuiPanel style={{ minHeight: 200 }}>
            <EuiLoadingContent data-test-subj="ml-versionDetailsLoading" lines={2} />
          </EuiPanel>
        </>
      ) : (
        <>
          <EuiSpacer size="m" />
          <ModelVersionInformation />
          <EuiSpacer size="m" />
          <ModelVersionTags />
        </>
      ),
    },
    {
      id: 'artifact-configuration',
      name: 'Artifact and configuration',
      content: loading ? (
        <>
          <EuiSpacer size="m" />
          <EuiPanel style={{ minHeight: 200 }}>
            <EuiLoadingContent data-test-subj="ml-versionDetailsLoading" lines={2} />
          </EuiPanel>
        </>
      ) : (
        <>
          <EuiSpacer size="m" />
          <ModelVersionArtifact />
        </>
      ),
    },
  ];

  return (
    <FormProvider {...form}>
      {!modelInfo ? (
        <>
          <EuiLoadingSpinner data-test-subj="modelVersionLoadingSpinner" />
          <EuiSpacer size="m" />
        </>
      ) : (
        <EuiPageHeader
          pageTitle={
            <EuiFlexGroup gutterSize="m" responsive={false} alignItems="center">
              <EuiFlexItem grow={false}>{modelInfo.name}</EuiFlexItem>
              <EuiFlexItem grow={false}>
                <VersionToggler
                  modelName={modelInfo.name}
                  currentVersion={modelInfo.version}
                  onVersionChange={onVersionChange}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          }
          rightSideGroupProps={{
            gutterSize: 'm',
          }}
          rightSideItems={[
            <EuiButton fill>Register version</EuiButton>,
            <EuiButton>Deploy</EuiButton>,
            <EuiButton color="danger">Delete</EuiButton>,
          ]}
        />
      )}
      <ModelVersionCallout modelVersionId="" modelState={MODEL_VERSION_STATE.deploying} />
      <ModelVersionCallout modelVersionId="" modelState={MODEL_VERSION_STATE.deployFailed} />
      <EuiSpacer size="m" />
      {loading ? (
        <EuiPanel style={{ minHeight: 200 }}>
          <EuiLoadingContent data-test-subj="ml-versionDetailsLoading" lines={2} />
        </EuiPanel>
      ) : (
        <ModelVersionDetails
          description={model?.description}
          modelId={model?.id}
          createdTime={model?.created_time}
          lastUpdatedTime={model?.last_updated_time}
        />
      )}
      <EuiSpacer size="m" />
      <EuiTabbedContent tabs={tabs} />
    </FormProvider>
  );
};