/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { OPEN_AI_API_ENDPOINT } from '../../server/routes/constants';
import { InnerHttpProvider } from './inner_http_provider';

export class OpenAI {
  public getCompletion(body: { prompt: string }) {
    return InnerHttpProvider.getHttp().post<Array<{ text: string }>>(OPEN_AI_API_ENDPOINT, {
      body: JSON.stringify(body),
    });
  }
}
