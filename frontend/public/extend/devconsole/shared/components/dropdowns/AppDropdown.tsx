import * as React from 'react';

import { Firehose } from '../../../../../components/utils';
import LabelDropdown from './LabelDropdown';

interface AppDropdownProps {
  activeNamespace?: string;
  canCreate?: boolean;
  onCreate?: (arg0: boolean) => void;
  onChange?: (arg0: string) => void;
}

const AppDropdown: React.FC<AppDropdownProps> = (props) => {
  const resources = [
    {
      isList: true,
      namespace: props.activeNamespace,
      kind: 'DeploymentConfig',
      prop: 'deploymentConfigs',
    },
    {
      isList: true,
      namespace: props.activeNamespace,
      kind: 'BuildConfig',
      prop: 'buildConfigs',
    },
    {
      isList: true,
      namespace: props.activeNamespace,
      kind: 'Service',
      prop: 'services',
    },
    {
      isList: true,
      namespace: props.activeNamespace,
      kind: 'Route',
      prop: 'routes',
    },
    {
      isList: true,
      namespace: props.activeNamespace,
      kind: 'Pod',
      prop: 'pods',
    },
  ];
  return (
    <Firehose resources={resources}>
      <LabelDropdown
        {...props}
        placeholder="Application Name"
        labelType="Application"
        labelSelector="app.kubernetes.io/part-of"
      />
    </Firehose>
  );
};

export default AppDropdown;
