/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from '../../../../../test/test_utils';
import { mockUseOpenSearchDashboards } from '../../../../../test/mock_opensearch_dashboards_react';
import { ModelVersionDeploymentConfirmModal } from '../model_version_deployment_confirm_modal';
import { ModelVersion } from '../../../../apis/model_version';

describe('<ModelVersionDeploymentConfirmModal />', () => {
  describe('model=deploy', () => {
    it('should render deploy title and confirm message', () => {
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="deploy"
        />
      );

      expect(screen.getByTestId('confirmModalTitleText')).toHaveTextContent(
        'Deploy model-1 version 1'
      );
      expect(screen.getByText('This version will begin deploying.')).toBeInTheDocument();
      expect(screen.getByText('model-1 version 1')).toHaveAttribute(
        'href',
        '/model-registry/model-version/1'
      );
    });

    it('should call model load after deploy button clicked', async () => {
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'load')
        .mockReturnValue(Promise.resolve({ task_id: 'foo', status: 'succeeded' }));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="deploy"
        />
      );

      expect(modelLoadMock).not.toHaveBeenCalled();
      await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));
      expect(modelLoadMock).toHaveBeenCalledTimes(1);

      modelLoadMock.mockRestore();
    });

    it('should show error toast if model load throw error', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'load')
        .mockRejectedValue(new Error('error'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="deploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));

      expect(screen.getByText('deployment failed.')).toBeInTheDocument();
      expect(screen.getByText('See full error')).toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });

    it('should show full error after "See full error" clicked', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'load')
        .mockRejectedValue(new Error('This is a full error message.'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="deploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));
      await userEvent.click(screen.getByText('See full error'));

      expect(screen.getByText('Error message:')).toBeInTheDocument();
      expect(screen.getByText('This is a full error message.')).toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });

    it('should hide full error after close button clicked', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'load')
        .mockRejectedValue(new Error('This is a full error message.'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="deploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));
      await userEvent.click(screen.getByText('See full error'));
      await userEvent.click(screen.getByText('Close'));

      expect(screen.queryByText('This is a full error message.')).not.toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });
  });

  describe('model=undeploy', () => {
    it('should render undeploy title and confirm message', () => {
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      expect(screen.getByTestId('confirmModalTitleText')).toHaveTextContent(
        'Undeploy model-1 version 1'
      );
      expect(
        screen.getByText('This version will be undeployed. You can deploy it again later.')
      ).toBeInTheDocument();
      expect(screen.getByText('model-1 version 1')).toHaveAttribute(
        'href',
        '/model-registry/model-version/1'
      );
    });

    it('should call model unload after undeploy button clicked', async () => {
      const modelLoadMock = jest.spyOn(ModelVersion.prototype, 'unload').mockImplementation();
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      expect(modelLoadMock).not.toHaveBeenCalled();
      await userEvent.click(screen.getByRole('button', { name: 'Undeploy' }));
      expect(modelLoadMock).toHaveBeenCalledTimes(1);

      modelLoadMock.mockRestore();
    });

    it('should show success toast after modal unload success', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest.spyOn(ModelVersion.prototype, 'unload').mockImplementation();
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Undeploy' }));

      await waitFor(() => {
        expect(screen.getByTestId('euiToastHeader')).toHaveTextContent(
          'Undeployed model-1 version 1'
        );
      });

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });

    it('should show error toast if model unload throw error', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'unload')
        .mockRejectedValue(new Error('error'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Undeploy' }));

      expect(screen.getByText('undeployment failed.')).toBeInTheDocument();
      expect(screen.getByText('See full error')).toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });

    it('should show full error after "See full error" clicked', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'unload')
        .mockRejectedValue(new Error('This is a full error message.'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Undeploy' }));
      await userEvent.click(screen.getByText('See full error'));

      expect(screen.getByText('Error message:')).toBeInTheDocument();
      expect(screen.getByText('This is a full error message.')).toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });

    it('should hide full error after close button clicked', async () => {
      const useOpenSearchDashboardsMock = mockUseOpenSearchDashboards();
      const modelLoadMock = jest
        .spyOn(ModelVersion.prototype, 'unload')
        .mockRejectedValue(new Error('This is a full error message.'));
      render(
        <ModelVersionDeploymentConfirmModal
          id="1"
          name="model-1"
          version="1"
          closeModal={jest.fn()}
          mode="undeploy"
        />
      );

      await userEvent.click(screen.getByRole('button', { name: 'Undeploy' }));
      await userEvent.click(screen.getByText('See full error'));
      await userEvent.click(screen.getByText('Close'));

      expect(screen.queryByText('This is a full error message.')).not.toBeInTheDocument();

      modelLoadMock.mockRestore();
      useOpenSearchDashboardsMock.mockRestore();
    });
  });
});