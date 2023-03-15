/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { createModelCluster } from './clusters/create_model_cluster';
import { MlCommonsPluginSetup, MlCommonsPluginStart } from './types';
import {
  modelRouter,
  modelAggregateRouter,
  profileRouter,
  securityRouter,
  taskRouter,
  modelRepositoryRouter,
} from './routes';
import { ModelService } from './services';
import { ConfigSchema } from './config';
import { openAIRouter } from './routes/openai_router';

export class MlCommonsPlugin implements Plugin<MlCommonsPluginSetup, MlCommonsPluginStart> {
  private readonly logger: Logger;
  private readonly openAIAPIKey: String;
  private readonly config$: any;

  constructor(initializerContext: PluginInitializerContext<ConfigSchema>) {
    this.logger = initializerContext.logger.get();
    this.config$ = initializerContext.config.create();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('mlCommons: Setup');
    const router = core.http.createRouter();

    const modelOSClient = createModelCluster(core);

    const modelService = new ModelService(modelOSClient);

    const services = {
      modelService,
    };

    modelRouter(services, router);
    modelAggregateRouter(router);
    profileRouter(router);
    securityRouter(router);
    taskRouter(router);
    modelRepositoryRouter(router);
    this.config$.subscribe((config) => {
      openAIRouter(router, config.openAIAPIKey);
      console.log('openAI API Key:', config.openAIAPIKey);
    });

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('mlCommons: Started');

    return {};
  }

  public stop() {}
}
