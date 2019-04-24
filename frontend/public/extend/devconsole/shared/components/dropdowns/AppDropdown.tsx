import * as React from 'react';

import { Firehose } from '../../../../../components/utils';
import { getActiveNamespace } from '../../../../../ui/ui-actions';
import LabelDropdown from './LabelDropdown';

const AppDropdown = (props) => {
  const activeNamespace = getActiveNamespace();
  const resources = [
    {
      isList: true,
      namespace: activeNamespace,
      kind: 'DeploymentConfig',
      prop: 'deploymentConfigs',
    },
    {
      isList: true,
      namespace: activeNamespace,
      kind: 'BuildConfig',
      prop: 'buildConfigs',
    },
    {
      isList: true,
      namespace: activeNamespace,
      kind: 'Service',
      prop: 'services',
    },
    {
      isList: true,
      namespace: activeNamespace,
      kind: 'Route',
      prop: 'routes',
    },
    {
      isList: true,
      namespace: activeNamespace,
      kind: 'Pod',
      prop: 'pods',
    },
  ];
  return (
    <Firehose resources={resources}>
      <LabelDropdown {...props} desc="Application Space" placeholder="Application Space" labelKind="Application" labelSelector="app" />
    </Firehose>
  );
};

export default AppDropdown;
