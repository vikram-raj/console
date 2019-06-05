/*eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { Checkbox } from './../../../../../public/components/checkbox';
import { EnvironmentPage } from './../../../../../public/components/environment';

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
interface BuildConfigProps {
  onConfigureWebhookChange: React.ReactEventHandler<HTMLInputElement>;
  onAutomaticallyBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onLaunchFirstBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onEnviromentVariableChange: (obj: NameValueType | NameValueFormType) => void;
  configureWebhookChecked: boolean;
  automaticallyBuildChecked: boolean;
  launchFirstBuildChecked: boolean;
  namespace: string;
}

const BuildConfig: React.FC<BuildConfigProps> = ({onConfigureWebhookChange,
  onAutomaticallyBuildChange,
  onLaunchFirstBuildChange,
  onEnviromentVariableChange,
  configureWebhookChecked,
  automaticallyBuildChecked,
  launchFirstBuildChecked,
  namespace}) => {

  const buildConfigObj = {
    metadata: {
      namespace: namespace
    }
  };

  return (
    <React.Fragment>
      <div className="co-section-heading">
        Build Configuration
      </div>

      <Checkbox
        label="Configure a webhook build trigger"
        name="configureWebhookBuild"
        onChange={onConfigureWebhookChange}
        checked={configureWebhookChecked} />

      <Checkbox
        label="Automatically build a new image when the builder image changes"
        name="automaticallyBuildImage"
        onChange={onAutomaticallyBuildChange}
        checked={automaticallyBuildChecked} />

      <Checkbox
        label="Launch the first build when the build configuration is created"
        name="launchFirstBuild"
        onChange={onLaunchFirstBuildChange}
        checked={launchFirstBuildChecked} />

      <div>
        <div className="co-section-heading-tertiary">
          Enviroment Variables (Build and Runtime)
        </div>
        <div>
          <EnvironmentPage
            envPath={['spec', 'strategy']}
            obj={buildConfigObj}
            readOnly={false}
            onChange={onEnviromentVariableChange}
            addConfigMapSecret={true}
            useLoadingInline={true} />
        </div>
      </div>
    </React.Fragment>);
};

export default BuildConfig;
