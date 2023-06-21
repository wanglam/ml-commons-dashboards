/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Model } from './model';
import { Profile } from './profile';
import { Task } from './task';

const apiInstanceStore: {
  model: Model | undefined;
  profile: Profile | undefined;
  task: Task | undefined;
} = {
  model: undefined,
  profile: undefined,
  task: undefined,
};

export class APIProvider {
  public static getAPI(type: 'task'): Task;
  public static getAPI(type: 'model'): Model;
  public static getAPI(type: 'profile'): Profile;
  public static getAPI(type: keyof typeof apiInstanceStore) {
    if (apiInstanceStore[type]) {
      return apiInstanceStore[type]!;
    }
    switch (type) {
      case 'model': {
        const newInstance = new Model();
        apiInstanceStore.model = newInstance;
        return newInstance;
      }
      case 'profile': {
        const newInstance = new Profile();
        apiInstanceStore.profile = newInstance;
        return newInstance;
      }
      case 'task': {
        const newInstance = new Task();
        apiInstanceStore.task = newInstance;
        return newInstance;
      }
    }
  }
  public static clear() {
    apiInstanceStore.model = undefined;
  }
}
