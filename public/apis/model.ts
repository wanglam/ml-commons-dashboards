/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MODEL_API_ENDPOINT,
  MODEL_LOAD_API_ENDPOINT,
  MODEL_UNLOAD_API_ENDPOINT,
} from '../../server/routes/constants';
import { MODEL_STATE, ModelSearchSort } from '../../common';
import { InnerHttpProvider } from './inner_http_provider';

export interface ModelSearchItem {
  id: string;
  name: string;
  algorithm: string;
  model_state: MODEL_STATE;
  model_version: string;
  current_worker_node_count: number;
  planning_worker_node_count: number;
  planning_worker_nodes: string[];
  model_config?: {
    all_config?: string;
    embedding_dimension: number;
    framework_type: string;
    model_type: string;
  };
}

export interface ModelSearchResponse {
  data: ModelSearchItem[];
  total_models: number;
}

export interface ModelLoadResponse {
  task_id: string;
  status: string;
}

export interface ModelUnloadResponse {
  [nodeId: string]: {
    stats: {
      [id: string]: string;
    };
  };
}

export class Model {
  public search(query: {
    sort?: ModelSearchSort[];
    from: number;
    size: number;
    states?: MODEL_STATE[];
    nameOrId?: string;
    ids?: string[];
  }) {
    return InnerHttpProvider.getHttp().get<ModelSearchResponse>(MODEL_API_ENDPOINT, {
      query,
    });
  }

  public getOne(id: string) {
    return InnerHttpProvider.getHttp().get<ModelSearchItem>(`${MODEL_API_ENDPOINT}/${id}`);
  }

  public load(id: string) {
    return InnerHttpProvider.getHttp().post<ModelLoadResponse>(`${MODEL_LOAD_API_ENDPOINT}/${id}`);
  }

  public unload(id: string) {
    return InnerHttpProvider.getHttp().post<ModelUnloadResponse>(
      `${MODEL_UNLOAD_API_ENDPOINT}/${id}`
    );
  }
}
