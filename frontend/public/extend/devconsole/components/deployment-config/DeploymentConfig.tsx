/*eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { Checkbox } from './../../../../../public/components/checkbox';
import { EnvironmentPage } from './../../../../components/environment';

interface NameValueType {
  name: string;
  value: string;
}

interface NameValueFormType {
  name: string;
  valueForm: {
    configMapKeyRef: {
      key: string;
      name: string
    }
  }
}

interface DeploymentConfigProps {
  onNewImageAvailableChange: React.ReactEventHandler<HTMLInputElement>;
  onDeploymentConfigChange: React.ReactEventHandler<HTMLInputElement>;
  onEnviromentVariableChange: (envPairs: (NameValueType | NameValueFormType)[]) => void;
  newImageAvailableChecked: boolean;
  deploymentConfigChecked: boolean;
  namespace: string;
}

const DeploymentConfig: React.FC<DeploymentConfigProps> = ({onNewImageAvailableChange,
  onDeploymentConfigChange,
  onEnviromentVariableChange,
  newImageAvailableChecked,
  deploymentConfigChecked,
  namespace}) => {

  const buildConfigObj = {
    metadata: {
      namespace,
    },
  };

  return (
    <React.Fragment>
      <div className="co-section-heading">
        Deployment Configuration
      </div>
      <div className="co-section-heading-tertiary">
        Autodeploy when
      </div>

      <Checkbox
        label="New image is available"
        name="newImageAvailable"
        onChange={onNewImageAvailableChange}
        checked={newImageAvailableChecked} />

      <Checkbox
        label="Deployment configuration changes"
        name="deploymentConfigurationChange"
        onChange={onDeploymentConfigChange}
        checked={deploymentConfigChecked} />

      <div>
        <div className="co-section-heading-tertiary">
          Enviroment Variables (Build and Runtime)
        </div>
        <div>
          <EnvironmentPage
            obj={buildConfigObj}
            envPath={['spec','template','spec','containers']}
            readOnly={false}
            onChange={onEnviromentVariableChange}
            addConfigMapSecret={true}
            useLoadingInline={true} />
        </div>
      </div>
    </React.Fragment>);
};

export default DeploymentConfig;
