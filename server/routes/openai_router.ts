/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema } from '@osd/config-schema';
import { Configuration, OpenAIApi } from 'openai';

import { IRouter, opensearchDashboardsResponseFactory } from '../../../../src/core/server';
import { OPEN_AI_API_ENDPOINT } from './constants';

export const openAIRouter = (router: IRouter, apiKey: string) => {
  router.post(
    {
      path: OPEN_AI_API_ENDPOINT,
      validate: {
        body: schema.object({
          prompt: schema.string(),
        }),
      },
    },
    async (_context, request) => {
      try {
        const configuration = new Configuration({
          apiKey,
        });
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createCompletion({
          model: 'code-davinci-002',
          prompt: request.body.prompt,
          temperature: 0,
          max_tokens: 2048,
          stop: '###',
        });
        return opensearchDashboardsResponseFactory.ok({ body: completion.data.choices });
      } catch (error) {
        return opensearchDashboardsResponseFactory.badRequest({ body: error as Error });
      }
    }
  );
};
