/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRouter, opensearchDashboardsResponseFactory } from '../../../../src/core/server';
import { OPEN_AI_API_ENDPOINT } from './constants';
import { Configuration, OpenAIApi } from 'openai';

export const openAIRouter = (router: IRouter, apiKey: string) => {
  router.get(
    {
      path: OPEN_AI_API_ENDPOINT,
      validate: false,
    },
    async (context, request) => {
      try {
        const configuration = new Configuration({
          apiKey,
        });
        const openai = new OpenAIApi(configuration);
        console.log('start completion');
        const completion = await openai.createCompletion({
          model: 'code-davinci-002',
          prompt: 'Generate an opensearch query to find all books name contain foo.',
          temperature: 0,
          max_tokens: 2048,
        });
        return opensearchDashboardsResponseFactory.ok({ body: completion.data.choices });
      } catch (error) {
        return opensearchDashboardsResponseFactory.badRequest({ body: error as Error });
      }
    }
  );
};
