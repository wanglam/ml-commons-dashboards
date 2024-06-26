/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const API_PREFIX = '/api/ml-commons';

export const MODEL_VERSION_API_ENDPOINT = `${API_PREFIX}/model-version`;
export const MODEL_VERSION_LOAD_API_ENDPOINT = `${MODEL_VERSION_API_ENDPOINT}/load`;
export const MODEL_VERSION_UNLOAD_API_ENDPOINT = `${MODEL_VERSION_API_ENDPOINT}/unload`;
export const MODEL_VERSION_PROFILE_API_ENDPOINT = `${MODEL_VERSION_API_ENDPOINT}/profile`;
export const MODEL_VERSION_UPLOAD_API_ENDPOINT = `${MODEL_VERSION_API_ENDPOINT}/upload`;

export const MODEL_AGGREGATE_API_ENDPOINT = `${API_PREFIX}/model-aggregate`;
export const PROFILE_API_ENDPOINT = `${API_PREFIX}/profile`;
export const DEPLOYED_MODEL_PROFILE_API_ENDPOINT = `${PROFILE_API_ENDPOINT}/deployed-model`;

export const MODEL_API_ENDPOINT = `${API_PREFIX}/model`;

export const SECURITY_API_ENDPOINT = `${API_PREFIX}/security`;
export const SECURITY_ACCOUNT_API_ENDPOINT = `${SECURITY_API_ENDPOINT}/account`;

export const TASK_API_ENDPOINT = `${API_PREFIX}/task`;

export const MODEL_REPOSITORY_API_ENDPOINT = `${API_PREFIX}/model-repository`;
export const MODEL_REPOSITORY_CONFIG_URL_API_ENDPOINT = `${MODEL_REPOSITORY_API_ENDPOINT}/config-url`;
