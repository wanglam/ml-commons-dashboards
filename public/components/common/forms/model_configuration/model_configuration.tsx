/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiButtonEmpty, EuiCodeBlock, EuiCodeEditor, EuiFormRow } from '@elastic/eui';
import { useController, useFormContext } from 'react-hook-form';

import { ErrorMessage } from './error_message';
import { HelpFlyout } from './help_flyout';
import { CUSTOM_FORM_ERROR_TYPES } from '../form_constants';

function validateConfigurationObject(value: string) {
  try {
    JSON.parse(value.trim());
  } catch {
    return 'JSON is invalid. Enter a valid JSON';
  }
  return true;
}

function validateModelType(value: string) {
  try {
    const config = JSON.parse(value.trim());
    if (!('model_type' in config)) {
      return 'model_type is required. Specify the model_type';
    }
  } catch {
    return true;
  }
  return true;
}

function validateModelTypeValue(value: string) {
  try {
    const config = JSON.parse(value.trim());
    if ('model_type' in config && typeof config.model_type !== 'string') {
      return 'model_type must be a string';
    }
  } catch {
    return true;
  }
  return true;
}

function validateEmbeddingDimensionValue(value: string) {
  try {
    const config = JSON.parse(value.trim());
    if ('embedding_dimension' in config && typeof config.embedding_dimension !== 'number') {
      return 'embedding_dimension must be a number';
    }
  } catch {
    return true;
  }

  return true;
}

function validateFrameworkTypeValue(value: string) {
  try {
    const config = JSON.parse(value.trim());
    if ('framework_type' in config && typeof config.framework_type !== 'string') {
      return 'framework_type must be a string';
    }
  } catch {
    return true;
  }
  return true;
}

interface Props {
  readOnly?: boolean;
}

export const ModelConfiguration = ({ readOnly = false }: Props) => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const { control } = useFormContext<{ configuration: string }>();
  const configurationFieldController = useController({
    name: 'configuration',
    control,
    rules: {
      required: { value: true, message: 'Configuration is required.' },
      validate: {
        [CUSTOM_FORM_ERROR_TYPES.INVALID_CONFIGURATION]: validateConfigurationObject,
        [CUSTOM_FORM_ERROR_TYPES.CONFIGURATION_MISSING_MODEL_TYPE]: validateModelType,
        [CUSTOM_FORM_ERROR_TYPES.INVALID_MODEL_TYPE_VALUE]: validateModelTypeValue,
        [CUSTOM_FORM_ERROR_TYPES.INVALID_EMBEDDING_DIMENSION_VALUE]: validateEmbeddingDimensionValue,
        [CUSTOM_FORM_ERROR_TYPES.INVALID_FRAMEWORK_TYPE_VALUE]: validateFrameworkTypeValue,
      },
    },
  });

  return (
    <>
      <EuiFormRow
        style={{ maxWidth: 800 }}
        label="JSON configuration"
        isInvalid={Boolean(configurationFieldController.fieldState.error)}
        error={<ErrorMessage error={configurationFieldController.fieldState.error} />}
        labelAppend={
          <EuiButtonEmpty
            onClick={() => setIsHelpVisible(true)}
            size="xs"
            color="primary"
            data-test-subj="model-configuration-help-button"
          >
            Help
          </EuiButtonEmpty>
        }
      >
        {readOnly ? (
          <EuiCodeBlock
            aria-label="readonly configuration"
            isCopyable
            language="json"
            overflowHeight={300}
          >
            {configurationFieldController.field.value}
          </EuiCodeBlock>
        ) : (
          <EuiCodeEditor
            tabSize={2}
            theme="sql_console"
            width="100%"
            showPrintMargin={false}
            height="10rem"
            mode="json"
            value={configurationFieldController.field.value}
            onChange={(value) => configurationFieldController.field.onChange(value)}
            setOptions={{
              fontSize: '14px',
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
            }}
          />
        )}
      </EuiFormRow>
      {isHelpVisible && <HelpFlyout onClose={() => setIsHelpVisible(false)} />}
    </>
  );
};
