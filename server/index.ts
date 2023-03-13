/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { ConfigSchema, configSchema } from './config';
import { MlCommonsPlugin } from './plugin';

export const config: PluginConfigDescriptor = {
  schema: configSchema,
};

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext<ConfigSchema>) {
  return new MlCommonsPlugin(initializerContext);
}

export { MlCommonsPluginSetup, MlCommonsPluginStart } from './types';
