import React from 'react';
import { EuiSpacer, EuiTitle } from '@elastic/eui';

import { CreateWorkspaceForm } from './create_workspace_form';

export const CreateWorkspace = () => {
  return (
    <div>
      <EuiTitle>
        <h1>Create Workspace</h1>
      </EuiTitle>
      <EuiSpacer />
      <CreateWorkspaceForm />
    </div>
  );
};
