/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '../../../../test/test_utils';
import { ModelConnectorFilter, ModelConnectorFilterValue } from '../model_connector_filter';

jest.mock('../../../apis/connector');

async function setup(value: ModelConnectorFilterValue[]) {
  const onChangeMock = jest.fn();
  const user = userEvent.setup({});
  render(
    <ModelConnectorFilter
      allExternalConnectors={[
        { id: 'external-connector-id-1', name: 'External Connector 1' },
        { id: 'common-connector-id', name: 'Common Connector' },
      ]}
      value={value}
      onChange={onChangeMock}
    />
  );
  await user.click(screen.getByText('Connector'));
  return { user, onChangeMock };
}

describe('<ModelConnector />', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeight as PropertyDescriptor
    );
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      originalOffsetWidth as PropertyDescriptor
    );
  });

  it('should render Connector filter and 1 selected filter number', async () => {
    await setup([{ name: 'External Connector 1', ids: ['external-connector-id-1'] }]);
    expect(screen.getByText('Connector')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('1 active filters')).toBeInTheDocument();
  });

  it('should render all connectors in the option list', async () => {
    await setup([{ name: 'External Connector 1', ids: ['external-connector-id-1'] }]);
    await waitFor(() => {
      expect(
        within(screen.getByRole('dialog')).getByText('Internal Connector 1')
      ).toBeInTheDocument();
      expect(
        within(screen.getByRole('dialog')).getByText('External Connector 1')
      ).toBeInTheDocument();
      expect(within(screen.getByRole('dialog')).getByText('Common Connector')).toBeInTheDocument();
    });
  });

  it('should call onChange with consistent params after option click', async () => {
    const { user, onChangeMock } = await setup([
      { name: 'External Connector 1', ids: ['external-connector-id-1'] },
    ]);

    await user.click(screen.getByText('Common Connector'));

    expect(onChangeMock).toHaveBeenLastCalledWith([
      { name: 'External Connector 1', ids: ['external-connector-id-1'] },
      { name: 'Common Connector', ids: ['common-connector-id'] },
    ]);
  });
});