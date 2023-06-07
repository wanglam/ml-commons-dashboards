import React, { useCallback, useState } from 'react';
import {
  EuiPanel,
  EuiSpacer,
  EuiTitle,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiText,
  EuiButton,
  EuiFlexItem,
  EuiCheckableCard,
  htmlIdGenerator,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiCard,
  EuiImage,
  EuiAccordion,
  EuiCheckbox,
  EuiCheckboxGroup,
} from '@elastic/eui';
import { defaultTemplates, defaultFeatureGroups } from './sample_data';
import {
  EuiCheckableCardProps,
  EuiCheckboxGroupProps,
  EuiCheckboxProps,
} from '@opensearch-project/oui';

interface WorkspaceTemplate {
  name: string;
  image: string;
  description: string;
  keyFeatures: string[];
}

interface WorkspaceFeature {
  id: string;
  name: string;
  template: string[];
}

interface WorkspaceFeatureGroup {
  name: string;
  features: WorkspaceFeature[];
}

interface CreateWorkspaceFormProps {
  templates: WorkspaceTemplate[];
  featureOrGroups: Array<WorkspaceFeature | WorkspaceFeatureGroup>;
}

export const CreateWorkspaceForm = ({
  templates = defaultTemplates,
  featureOrGroups = defaultFeatureGroups,
}: CreateWorkspaceFormProps) => {
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>();
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);

  const handleTemplateCardChange = useCallback<EuiCheckableCardProps['onChange']>(
    (e) => {
      const templateName = e.target.value;
      setSelectedTemplateName(templateName);
      setSelectedFeatureIds(
        featureOrGroups.reduce<string[]>(
          (previousData, currentData) => [
            ...previousData,
            ...('features' in currentData ? currentData.features : [currentData])
              .filter(({ template }) => template.includes(templateName))
              .map((feature) => feature.id),
          ],
          []
        )
      );
    },
    [featureOrGroups]
  );

  const handleFeatureChange = useCallback<EuiCheckboxGroupProps['onChange']>((featureId) => {
    setSelectedFeatureIds((previousData) =>
      previousData.includes(featureId)
        ? previousData.filter((id) => id !== featureId)
        : [...previousData, featureId]
    );
  }, []);

  const handleFeatureCheckboxChange = useCallback<EuiCheckboxProps['onChange']>(
    (e) => {
      handleFeatureChange(e.target.id);
    },
    [handleFeatureChange]
  );

  const handleFeatureGroupChange = useCallback<EuiCheckboxProps['onChange']>(
    (e) => {
      handleFeatureChange(e.target.id);
      for (let featureOrGroup of featureOrGroups) {
        if ('features' in featureOrGroup && featureOrGroup.name === e.target.id) {
          const groupFeatureIds = featureOrGroup.features.map((feature) => feature.id);
          setSelectedFeatureIds((previousData) => {
            const notExistsIds = groupFeatureIds.filter((id) => !previousData.includes(id));
            if (notExistsIds.length > 0) {
              return [...previousData, ...notExistsIds];
            }
            return previousData.filter((id) => !groupFeatureIds.includes(id));
          });
        }
      }
    },
    [featureOrGroups]
  );

  return (
    <EuiForm>
      <EuiPanel>
        <EuiTitle size="s">
          <h2>Workspace details</h2>
        </EuiTitle>
        <EuiSpacer />
        <EuiFormRow label="Name">
          <EuiFieldText />
        </EuiFormRow>
        <EuiFormRow
          label={
            <>
              Description - <i>optional</i>
            </>
          }
        >
          <EuiFieldText />
        </EuiFormRow>
      </EuiPanel>
      <EuiSpacer />
      <EuiPanel>
        <EuiTitle size="s">
          <h2>Workspace Template</h2>
        </EuiTitle>
        <EuiSpacer />
        <EuiFlexGrid columns={2}>
          {templates.map((template, index) => (
            <EuiFlexItem key={template.name}>
              <EuiCheckableCard
                id={htmlIdGenerator()()}
                title={template.name}
                label={template.name}
                value={template.name}
                checked={template.name === selectedTemplateName}
                onChange={handleTemplateCardChange}
              />
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
        <EuiSpacer />
        {selectedTemplate && (
          <>
            <EuiTitle size="xs">
              <h3>Features</h3>
            </EuiTitle>
            <EuiSpacer />
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiImage src={selectedTemplate.image} alt={selectedTemplate.name} />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText>{selectedTemplate.description}</EuiText>
                <EuiTitle size="xs">
                  <h4>Key Features:</h4>
                </EuiTitle>
                <EuiSpacer />
                <EuiFlexGrid style={{ paddingLeft: 20, paddingRight: 100 }} columns={2}>
                  {selectedTemplate.keyFeatures.map((feature) => (
                    <EuiFlexItem key={feature}>• {feature}</EuiFlexItem>
                  ))}
                </EuiFlexGrid>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer />
          </>
        )}
        <EuiAccordion
          id={htmlIdGenerator()()}
          buttonContent={
            <>
              <EuiTitle size="xs">
                <h3>Advanced Options</h3>
              </EuiTitle>
            </>
          }
        >
          <EuiFlexGrid style={{ paddingLeft: 20, paddingTop: 20 }} columns={2}>
            {featureOrGroups.map((featureOrGroup) => {
              const features = 'features' in featureOrGroup ? featureOrGroup.features : [];
              const selectedIds = selectedFeatureIds.filter((id) =>
                ('features' in featureOrGroup ? featureOrGroup.features : [featureOrGroup]).find(
                  (item) => item.id === id
                )
              );
              return (
                <EuiFlexItem key={featureOrGroup.name}>
                  <EuiCheckbox
                    id={'features' in featureOrGroup ? featureOrGroup.name : featureOrGroup.id}
                    onChange={
                      'features' in featureOrGroup
                        ? handleFeatureGroupChange
                        : handleFeatureCheckboxChange
                    }
                    label={`${featureOrGroup.name}${
                      features.length > 0 ? `(${selectedIds.length}/${features.length})` : ''
                    }`}
                    checked={selectedIds.length > 0}
                    indeterminate={
                      'features' in featureOrGroup &&
                      selectedIds.length > 0 &&
                      selectedIds.length < features.length
                    }
                  />
                  {'features' in featureOrGroup && (
                    <EuiCheckboxGroup
                      options={featureOrGroup.features.map((item) => ({
                        id: item.id,
                        label: item.name,
                      }))}
                      idToSelectedMap={selectedIds.reduce(
                        (previousValue, currentValue) => ({
                          ...previousValue,
                          [currentValue]: true,
                        }),
                        {}
                      )}
                      onChange={handleFeatureChange}
                      style={{ marginLeft: 40 }}
                    />
                  )}
                </EuiFlexItem>
              );
            })}
          </EuiFlexGrid>
        </EuiAccordion>
      </EuiPanel>
      <EuiSpacer />
      <EuiPanel>
        <EuiTitle size="s">
          <h2>Workspace permissions</h2>
        </EuiTitle>
      </EuiPanel>
      <EuiSpacer />
      <EuiText textAlign="right">
        <EuiButton>Create workspace</EuiButton>
      </EuiText>
    </EuiForm>
  );
};
