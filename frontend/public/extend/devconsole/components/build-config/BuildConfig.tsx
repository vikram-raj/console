/*eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { FieldLevelHelp } from 'patternfly-react';
import { EnvironmentPage } from './../../../../../public/components/environment';

import './BuildConfig.scss';

interface BuildConfigProps {
  onConfigureWebhookChange: React.ReactEventHandler<HTMLInputElement>;
  onAutomaticallyBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onLaunchFirstBuildChange: React.ReactEventHandler<HTMLInputElement>;
  onEnviromentVariableChange: (obj: Object) => void;
}

export default class BuildConfig extends React.PureComponent<BuildConfigProps> {

  onConfigureWebhookChange = () => {}

  render() {
    const {
      onConfigureWebhookChange,
      onAutomaticallyBuildChange,
      onLaunchFirstBuildChange,
      onEnviromentVariableChange,
    } = this.props;

    return (
      <div className="odc-build-config">
        <div className="odc-build-config__header">
          <div className="odc-build-config__header-left co-section-heading">
            Build Configuration
          </div>
          <div className="odc-build-config__header-right">
            <FieldLevelHelp content="A build configuration describes how to build your deployable image. This includes your source, the base builder image, and when to launch new builds." />
            <a href="#">About Build Configuration</a>
          </div>
        </div>
        <div className="checkbox">
          <label htmlFor="configure-webhook" className="control-label">
            <input type="checkbox" id="configure-webhook" onChange={onConfigureWebhookChange} />
            Configure a webhook build trigger
            <FieldLevelHelp content="The source repository must be configured to use the webhook to trigger a build when source is committed." />
          </label>
        </div>
        <div className="checkbox">
          <label htmlFor="automatically-build-image" className="control-label">
            <input type="checkbox" id="automatically-build-image" onChange={onAutomaticallyBuildChange} />
            Automatically build a new image when the builder image changes
            <FieldLevelHelp content="Automatically building a new image when the builder image changes allows your code to always run on the latest updates." />
          </label>
        </div>
        <div className="checkbox">
          <label htmlFor="launch-first-build" className="control-label">
            <input type="checkbox" id="launch-first-build"
              name="launch-first-build" onChange={onLaunchFirstBuildChange} />
            Launch the first build when the build configuration is created
          </label>
        </div>
        <div className="odc-build-config__env-variable">
          <div className="co-section-heading-tertiary">
            Enviroment Variables (Build and Runtime)
            <FieldLevelHelp content="Environment variables are used to configure and pass information to running containers. These environment variables will be available during your build and at runtime." />
          </div>
          <div>
            <EnvironmentPage
              envPath={['spec', 'strategy']}
              readOnly={false}
              onChange={onEnviromentVariableChange}
              addConfigMapSecret={true}
              useLoadingInline={true} />
          </div>
        </div>
      </div>
    );
  }
}
