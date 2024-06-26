/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import { render, screen, within } from '../../../../test/test_utils';
import { ModelOverviewCard } from '../model_overview_card';

describe('<ModelOverviewCard />', () => {
  it('should model overview information according passed data', () => {
    render(
      <ModelOverviewCard
        id="model-1-id"
        description="Model description of model 1"
        isModelOwner
        owner="Foo"
        createdTime={1682324310318}
        updatedTime={1682342310318}
      />
    );

    expect(screen.getByText('Model description of model 1')).toBeInTheDocument();
    expect(screen.getByText('Foo (you)')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(
      within(screen.getByText('Created').closest('dl')!).getByText('Apr 24, 2023 @ 08:18:30.318')
    ).toBeInTheDocument();
    expect(screen.getByText('Last updated')).toBeInTheDocument();
    expect(
      within(screen.getByText('Last updated').closest('dl')!).getByText(
        'Apr 24, 2023 @ 13:18:30.318'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('model-1-id')).toBeInTheDocument();
    expect(
      within(screen.getByText('model-1-id')).getByTestId('copy-id-button')
    ).toBeInTheDocument();
  });

  it('should display "-" for empty description', () => {
    render(
      <ModelOverviewCard
        id="model-1-id"
        isModelOwner
        owner="Foo"
        createdTime={1682324310318}
        updatedTime={1682342310318}
      />
    );
    expect(
      within(screen.getByText('Description').closest('dl')!).getByText('-')
    ).toBeInTheDocument();
  });
});
