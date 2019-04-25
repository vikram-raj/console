/* eslint-disable no-undef, no-unused-vars */

import * as React from 'react';
import * as _ from 'lodash-es';
import { connect } from 'react-redux';

import { LoadingBox, LoadError } from '../../../../components/utils/status-box';
import { Dropdown, history, MsgBox, NsDropdown, ResourceName } from '../../../../components/utils';
import {
  BuildConfigModel,
  DeploymentConfigModel,
  ImageStreamModel,
  ImageStreamTagModel,
  RouteModel,
  ServiceModel,
} from '../../../../models';
import { ContainerPort, k8sCreate, k8sGet, K8sResourceKind } from '../../../../module/k8s';
import { getBuilderTagsSortedByVersion } from '../../../../components/image-stream';
import { ButtonBar } from '../../../../components/utils/button-bar';
import PerspectiveLink from '../../shared/components/PerspectiveLink';
import { getActivePerspective } from '../../../../ui/ui-selectors';
import AppDropdown from '../../shared/components/dropdown/AppDropdown';
import { pathWithPerspective } from '../../../../components/utils/perspective';
import {
  getPorts,
  getSampleRepo,
  getSampleRef,
  getSampleContextDir,
  makePortName,
} from '../../utils/imagestream-utils';
import ImageStreamInfo from './ImageStreamInfo';

const mapBuildSourceStateToProps = (state) => {
  return {
    activePerspective: getActivePerspective(state),
  };
};

const CREATE_APPLICATION_KEY = 'create-application-key';

class BuildSource extends React.Component<
  BuildSourceStateProps & BuildSourceProps,
  BuildSourceState
  > {
  constructor(props) {
    super(props);

    const { preselectedNamespace: namespace = '' } = this.props;
    this.state = {
      tags: [],
      namespace,
      application: '',
      selectedApplicationKey: '',
      showApplicationInput: false,
      selectedTag: '',
      name: '',
      repository: '',
      ref: '',
      contextDir: '',
      createRoute: false,
      ports: [],
      inProgress: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (_.isEmpty(props.obj.data)) {
      return null;
    }
    const previousTag = state.selectedTag;
    // Sort tags in reverse order by semver, falling back to a string comparison if not a valid version.
    const tags = getBuilderTagsSortedByVersion(props.obj.data);
    // Select the first tag if the current tag is missing or empty.
    const selectedTag =
      previousTag && _.includes(tags, previousTag) ? previousTag : _.get(_.head(tags), 'name');

    return { tags, selectedTag };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedTag !== this.state.selectedTag) {
      this.getImageStreamImage();
    }
  }

  onNamespaceChange = (namespace: string) => {
    this.setState({ namespace });
  };

  onApplicationDropdownChange = (application: string, selectedKey: string) => {
    if (selectedKey === CREATE_APPLICATION_KEY) {
      this.setState({
        application: '',
        showApplicationInput: true,
        selectedApplicationKey: selectedKey,
      });
    } else {
      this.setState({
        application,
        showApplicationInput: false,
        selectedApplicationKey: selectedKey,
      });
    }
  };

  onApplicationInputChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    this.setState({ application: event.currentTarget.value });
  };

  onTagChange = (selectedTag: any) => {
    this.setState({ selectedTag }, this.getImageStreamImage);
  };

  onNameChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    this.setState({ name: event.currentTarget.value });
  };

  onRepositoryChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    // Reset ref and context dir if previously set from filling in a sample.
    this.setState({ repository: event.currentTarget.value, ref: '', contextDir: '' });
  };

  onCreateRouteChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    this.setState({ createRoute: event.currentTarget.checked });
  };

  fillSample: React.ReactEventHandler<HTMLButtonElement> = (event) => {
    const {
      obj: { data: imageStream },
    } = this.props;
    const { name: currentName, selectedTag } = this.state;
    const tag = _.find(imageStream.spec.tags, { name: selectedTag });
    const repository = getSampleRepo(tag);
    const ref = getSampleRef(tag);
    const contextDir = getSampleContextDir(tag);
    const name = currentName || imageStream.metadata.name;
    this.setState({ name, repository, ref, contextDir });
  };

  getImageStreamImage = () => {
    const { selectedTag } = this.state;
    if (!selectedTag) {
      return;
    }

    const {
      obj: { data: imageStream },
    } = this.props;
    const imageStreamTagName = `${imageStream.metadata.name}:${selectedTag}`;
    this.setState({ inProgress: true });
    k8sGet(ImageStreamTagModel, imageStreamTagName, imageStream.metadata.namespace).then(
      (imageStreamImage: K8sResourceKind) => {
        const ports = getPorts(imageStreamImage);
        this.setState({ ports, inProgress: false });
      },
      (err) => this.setState({ error: err.message, inProgress: false }),
    );
  };

  getLabels() {
    const { name, application } = this.state;
    const {
      obj: { data: imageStream },
    } = this.props;
    return {
      app: name,
      'app.kubernetes.io/part-of': application,
      'app.kubernetes.io/name': imageStream.metadata.name,
      'app.kubernetes.io/instance': name,
      'app.kubernetes.io/component': name,
    };
  }

  getPodLabels() {
    const { name } = this.state;
    return {
      app: name,
      deploymentconfig: name,
    };
  }

  createImageStream(): Promise<K8sResourceKind> {
    const { name, namespace } = this.state;
    const labels = this.getLabels();
    const imageStream = {
      apiVersion: 'image.openshift.io/v1',
      kind: 'ImageStream',
      metadata: {
        name,
        namespace,
        labels,
      },
    };

    return k8sCreate(ImageStreamModel, imageStream);
  }

  createBuildConfig(): Promise<K8sResourceKind> {
    const {
      obj: { data: imageStream },
    } = this.props;
    const { name, namespace, repository, ref = 'master', contextDir, selectedTag } = this.state;
    const labels = this.getLabels();
    const buildConfig = {
      apiVersion: 'build.openshift.io/v1',
      kind: 'BuildConfig',
      metadata: {
        name,
        namespace,
        labels,
      },
      spec: {
        output: {
          to: {
            kind: 'ImageStreamTag',
            name: `${name}:latest`,
          },
        },
        source: {
          contextDir,
          git: {
            uri: repository,
            ref,
            type: 'Git',
          },
        },
        strategy: {
          type: 'Source',
          sourceStrategy: {
            from: {
              kind: 'ImageStreamTag',
              name: `${imageStream.metadata.name}:${selectedTag}`,
              namespace: imageStream.metadata.namespace,
            },
          },
        },
        triggers: [
          {
            type: 'ImageChange',
            imageChange: {},
          },
          {
            type: 'ConfigChange',
          },
        ],
      },
    };

    return k8sCreate(BuildConfigModel, buildConfig);
  }

  createDeploymentConfig(): Promise<K8sResourceKind> {
    const { name, namespace, ports } = this.state;
    const labels = this.getLabels();
    const podLabels = this.getPodLabels();
    const deploymentConfig = {
      apiVersion: 'apps.openshift.io/v1',
      kind: 'DeploymentConfig',
      metadata: {
        name,
        namespace,
        labels,
      },
      spec: {
        selector: podLabels,
        replicas: 1,
        template: {
          metadata: {
            labels: podLabels,
          },
          spec: {
            containers: [
              {
                name,
                image: `${name}:latest`,
                ports,
                env: [],
              },
            ],
          },
        },
        triggers: [
          {
            type: 'ImageChange',
            imageChangeParams: {
              automatic: true,
              containerNames: [name],
              from: {
                kind: 'ImageStreamTag',
                name: `${name}:latest`,
              },
            },
          },
          {
            type: 'ConfigChange',
          },
        ],
      },
    };

    return k8sCreate(DeploymentConfigModel, deploymentConfig);
  }

  createService(): Promise<K8sResourceKind> {
    const { name, namespace, ports } = this.state;
    const firstPort = _.head(ports);
    const labels = this.getLabels();
    const podLabels = this.getPodLabels();
    const service = {
      kind: 'Service',
      apiVersion: 'v1',
      metadata: {
        name,
        namespace,
        labels,
      },
      spec: {
        selector: podLabels,
        ports: [
          {
            port: firstPort.containerPort,
            targetPort: firstPort.containerPort,
            protocol: firstPort.protocol,
            // Use the same naming convention as the CLI.
            name: makePortName(firstPort),
          },
        ],
      },
    };

    return k8sCreate(ServiceModel, service);
  }

  createRoute(): Promise<K8sResourceKind> {
    const { name, namespace, ports } = this.state;
    const firstPort = _.head(ports);
    const labels = this.getLabels();
    const route = {
      kind: 'Route',
      apiVersion: 'route.openshift.io/v1',
      metadata: {
        name,
        namespace,
        labels,
      },
      spec: {
        to: {
          kind: 'Service',
          name,
        },
        // The service created by `createService` uses the same port as the container port.
        port: {
          // Use the port name, not the number for targetPort. The router looks
          // at endpoints, not services, when resolving ports, so port numbers
          // will not resolve correctly if the service port and container port
          // numbers don't match.
          targetPort: makePortName(firstPort),
        },
        wildcardPolicy: 'None',
      },
    };

    return k8sCreate(RouteModel, route);
  }

  handleError = (err) => {
    this.setState({
      error: this.state.error ? `${this.state.error}; ${err.message}` : err.message,
    });
  };

  save = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const { activePerspective } = this.props;
    const { namespace, selectedTag, name, repository, createRoute, ports } = this.state;
    if (!name || !selectedTag || !namespace || !repository) {
      this.setState({ error: 'Please complete all fields.' });
      return;
    }

    const requests = [
      this.createDeploymentConfig(),
      this.createImageStream(),
      this.createBuildConfig(),
    ];

    // Only create a service or route if the builder image has ports.
    if (!_.isEmpty(ports)) {
      requests.push(this.createService());
      if (createRoute) {
        requests.push(this.createRoute());
      }
    }

    requests.forEach((r) => r.catch(this.handleError));
    this.setState({ inProgress: true, error: null });
    Promise.all(requests)
      .then(() => {
        this.setState({ inProgress: false });
        if (!this.state.error) {
          history.push(
            pathWithPerspective(activePerspective, `/overview/ns/${this.state.namespace}`),
          );
        }
      })
      .catch(() => this.setState({ inProgress: false }));
  };

  render() {
    const { obj } = this.props;
    const { selectedTag, tags, ports } = this.state;
    if (obj.loadError) {
      return (
        <LoadError
          message={obj.loadError.message}
          label="Image Stream"
          className="loading-box loading-box__errored"
        />
      );
    }

    if (!obj.loaded) {
      return <LoadingBox />;
    }

    const imageStream = obj.data;
    if (_.isEmpty(tags)) {
      return (
        <MsgBox
          title="No Builder Tags"
          detail={`ImageStream ${imageStream.metadata.name} has no Source-to-Image builder tags.`}
        />
      );
    }

    const tag = _.find(imageStream.spec.tags, { name: selectedTag });
    const sampleRepo = getSampleRepo(tag);

    const tagOptions = {};
    _.each(
      tags,
      ({ name }) =>
        (tagOptions[name] = (
          <ResourceName kind="ImageStreamTag" name={`${imageStream.metadata.name}:${name}`} />
        )),
    );
    return (
      <div className="row">
        <div className="col-md-7 col-md-push-5 co-catalog-item-info">
          <ImageStreamInfo imageStream={imageStream} tag={tag} />
        </div>
        <div className="col-md-5 col-md-pull-7">
          <form className="co-source-to-image-form" onSubmit={this.save}>
            <div className="form-group">
              <label className="control-label co-required" htmlFor="namespace">
                Namespace
              </label>
              <NsDropdown
                selectedKey={this.state.namespace}
                onChange={this.onNamespaceChange}
                id="namespace"
              />
            </div>
            <div className="form-group">
              <label className="control-label co-required" htmlFor="appname">
                Application
              </label>
              <AppDropdown
                namespace={this.state.namespace}
                actionItem={{
                  actionTitle: 'Create New Application',
                  actionKey: CREATE_APPLICATION_KEY,
                }}
                selectedKey={this.state.selectedApplicationKey}
                onChange={this.onApplicationDropdownChange}
              />
            </div>
            {this.state.showApplicationInput ? (
              <div className="form-group">
                <label className="control-label co-required" htmlFor="name">
                  Application Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  onChange={this.onApplicationInputChange}
                  value={this.state.application}
                  id="name"
                  aria-describedby="name-help"
                  required
                />
                <div className="help-block" id="name-help">
                  Names the application.
                </div>
              </div>
            ) : null}
            <div className="form-group">
              <label className="control-label co-required" htmlFor="tag">
                Version
              </label>
              <Dropdown
                items={tagOptions}
                selectedKey={selectedTag}
                title={tagOptions[selectedTag]}
                onChange={this.onTagChange}
                id="tag"
              />
            </div>
            <div className="form-group">
              <label className="control-label co-required" htmlFor="name">
                Name
              </label>
              <input
                className="form-control"
                type="text"
                onChange={this.onNameChange}
                value={this.state.name}
                id="name"
                aria-describedby="name-help"
                required
              />
              <div className="help-block" id="name-help">
                Names the resources created for this application.
              </div>
            </div>
            <div className="form-group">
              <label className="control-label co-required" htmlFor="repository">
                Git Repository
              </label>
              <input
                className="form-control"
                type="text"
                onChange={this.onRepositoryChange}
                value={this.state.repository}
                id="repository"
                required
              />
              {sampleRepo && (
                <div className="help-block">
                  <button
                    type="button"
                    className="btn btn-link btn-link--no-padding"
                    onClick={this.fillSample}
                  >
                    Try Sample <i className="fa fa-level-up" aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="help-block">
                For private Git repositories, create a{' '}
                <PerspectiveLink
                  to={`/k8s/ns/${this.state.namespace || 'default'}/secrets/new/source`}
                >
                  source secret
                </PerspectiveLink>
                .
              </div>
            </div>
            {!_.isEmpty(ports) && (
              <div className="form-group">
                <div className="checkbox">
                  <label className="control-label">
                    <input
                      type="checkbox"
                      onChange={this.onCreateRouteChange}
                      checked={this.state.createRoute}
                      aria-describedby="create-route-help"
                    />
                    Create route
                  </label>
                  <div className="help-block" id="create-route-help">
                    Exposes your application at a public URL.
                  </div>
                </div>
              </div>
            )}
            <ButtonBar
              className="co-source-to-image-form__button-bar"
              errorMessage={this.state.error}
              inProgress={this.state.inProgress}
            >
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <button type="button" className="btn btn-default" onClick={history.goBack}>
                Cancel
              </button>
            </ButtonBar>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapBuildSourceStateToProps)(BuildSource);

export type BuildSourceProps = {
  obj: any;
  preselectedNamespace: string;
};

export type BuildSourceState = {
  tags: any[];
  namespace: string;
  application: string;
  selectedApplicationKey: string;
  showApplicationInput: boolean;
  selectedTag: string;
  name: string;
  repository: string;
  ref: string;
  contextDir: string;
  createRoute: boolean;
  ports: ContainerPort[];
  inProgress: boolean;
  error?: any;
};

interface BuildSourceStateProps {
  activePerspective: string;
}
