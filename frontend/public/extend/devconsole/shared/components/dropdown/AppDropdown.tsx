/* eslint-disable no-unused-vars, no-undef */
import * as React from 'react';

import LabelDropdown from './LabelDropdown';
import { Firehose } from '../../../../../components/utils';

interface AppDropdownProps {
  namespace?: string;
  actionItem?: {
    actionTitle: string,
    actionKey: string,
  };
  selectedKey: string,
  onChange?: (arg0: string, arg1: string) => void;
}

const AppDropdown: React.FC<AppDropdownProps> = (props) => {
  const resources = [
    {
      isList: true,
      namespace: props.namespace,
      kind: 'DeploymentConfig',
      prop: 'deploymentConfigs',
    },
    {
      isList: true,
      namespace: props.namespace,
      kind: 'BuildConfig',
      prop: 'buildConfigs',
    },
    {
      isList: true,
      namespace: props.namespace,
      kind: 'Service',
      prop: 'services',
    },
    {
      isList: true,
      namespace: props.namespace,
      kind: 'Route',
      prop: 'routes',
    },
    {
      isList: true,
      namespace: props.namespace,
      kind: 'Pod',
      prop: 'pods',
    },
  ];
  return (
    <Firehose resources={resources}>
      <LabelDropdown
        {...props}
        placeholder="Select an Application"
        labelType="Application"
        labelSelector="app.kubernetes.io/part-of"
      />
    </Firehose>
  );
};

export default AppDropdown;
