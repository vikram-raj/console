/*eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { Checkbox } from 'patternfly-react';
import { EnvironmentPage } from './../../../../components/environment';

interface NameValueType {
  name: string;
  value: string;
}
interface configMapKeyType {
  configMapKeyRef: {
    key: string;
    name: string
  }
}

interface secretKeyRefType {
  secretKeyRef: {
    key: string;
    name: string;
  }
}
interface NameValueFormType {
  name: string;
  valueForm: configMapKeyType | secretKeyRefType;
}
interface BuildConfigProps {
  onConfigureWebhookChange: React.ReactEventHandler<HTMLInputElement>;
  onAutomaticallyBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onLaunchFirstBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onEnviromentVariableChange: (envPairs:( NameValueType | NameValueFormType)[]) => void;
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
      namespace,
    },
  };

  return (
    <React.Fragment>
      <div className="co-section-heading">
        Build Configuration
      </div>

      <Checkbox
        name="configureWebhookBuild"
        onChange={onConfigureWebhookChange}
        checked={configureWebhookChecked}>
        Configure a webhook build trigger
      </Checkbox>

      <Checkbox
        name="automaticallyBuildImage"
        onChange={onAutomaticallyBuildChange}
        checked={automaticallyBuildChecked}>
        Automatically build a new image when the builder image changes
      </Checkbox>

      <Checkbox
        name="launchFirstBuild"
        onChange={onLaunchFirstBuildChange}
        checked={launchFirstBuildChecked}>
        Launch the first build when the build configuration is created
      </Checkbox>

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
