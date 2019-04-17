/* eslint-disable no-undef */
import * as React from 'react';
import { connect } from 'react-redux';
import * as fuzzy from 'fuzzysearch';
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Button } from 'patternfly-react';
import { Dropdown } from './../../../../../public/components/utils';
import { getActiveNamespace } from '../../../../ui/ui-actions';
import { history } from './../../../../../public/components/utils/router';
import { GitSourceModel } from '../../../../models';
import { k8sCreate, k8sUpdate, k8sKill } from '../../../../module/k8s';
import './ImportFlowForm.scss';

interface State {
  gitType: string,
  gitRepoUrl: string,
  applicationName: string,
  name: string,
  builderImage: string,
  gitTypeError: string,
  applicationNameError: string,
  nameError: string,
  builderImageError: string,
  gitRepoUrlError: string,
  gitSourceName: string,
  gitSourceCreated: boolean,
  resourceVersion: string,
  lastEnteredGitUrl: string,
}

interface NameSpace {
  metadata: {
    name: string,
    selfLink: string,
    uid: string,
    resourceVersion: string,
    creationTimestamp: string,
  }
}

interface Props {
  namespace: {
    data: Array<NameSpace>,
  }
}

const initialState: State = {
  gitType: '',
  gitRepoUrl: '',
  applicationName: '',
  name: '',
  builderImage: '',
  gitTypeError: '',
  gitRepoUrlError: '',
  applicationNameError: '',
  nameError: '',
  builderImageError: '',
  gitSourceName: '',
  gitSourceCreated: false,
  resourceVersion: '',
  lastEnteredGitUrl: '',
};

export class ImportFlowForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      gitType: '',
      gitRepoUrl: '',
      applicationName: '',
      name: '',
      builderImage: '',
      gitTypeError: '',
      applicationNameError: '',
      nameError: '',
      builderImageError: '',
      gitRepoUrlError: '',
      gitSourceName: '',
      gitSourceCreated: false,
      resourceVersion: '',
      lastEnteredGitUrl: '',
    };
  }
  private randomString = '';

  componentDidMount() {
    const activeNamespace = getActiveNamespace();
    this.randomString = this._generateRandomString();
    this.setState({ applicationName: activeNamespace });
  }

  //Fix me when Create button functionality is in
  componentWillUnmount() {
    if (this.state.gitSourceCreated) {
      k8sKill(GitSourceModel, this._gitSourceParams(this.state.gitSourceName), {}, {}).then(() => {
        this.setState({
          gitSourceCreated: false,
        });
      });
    }
  }

  gitTypes = {
    '': 'please choose Git type',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'bitbucket': 'Bitbucket',
  };

  builderImages = {
    '': 'Please choose builder image',
    '.net': '.Net',
    'nodejs': 'Node.js',
    'perl': 'Perl',
    'php': 'PHP',
    'python': 'Python',
    'ruby': 'Ruby',
    'redhatopenjdk8': 'Red Hat OpenJDK 8',
  };

  handleGitTypeChange = (gitType: string) => {
    this.setState({ gitType });
  }

  handleGitRepoUrlChange = (event) => {
    let timeOut;
    this.setState({ gitRepoUrl: event.target.value });
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      if (this.state.gitRepoUrl.length % 3 === 0) {
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        if (!urlRegex.test(this.state.gitRepoUrl)) {
          this.setState({ gitRepoUrlError: 'Please enter the valid git URL' });
        } else {
          this.setState({ gitRepoUrlError: '' });
        }
      }
    }, 2000);
  }

  handleApplicationNameChange = (applicationName: string) => {
    this.setState({ applicationName });
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleBuilderImageChange = (builderImage: string) => {
    this.setState({ builderImage });
  }

  private _generateRandomString() {
    const str = Math.random()
      .toString(16)
      .substring(2, 7);
    return str + str;
  }

  private _lastSegmentUrl() {
    return this.state.gitRepoUrl.substr(this.state.gitRepoUrl.lastIndexOf('/') + 1);
  }

  private _gitSourceParams(name: string) {
    return {
      kind: 'GitSource',
      apiVersion: 'devconsole.openshift.io/v1alpha1',
      metadata: {
        name: name,
        resourceVersion: this.state.resourceVersion,
      },
      spec: {
        url: this.state.gitRepoUrl,
      },
    };
  }

  validateGitRepo = (): void => {
    GitSourceModel.path = `namespaces/${getActiveNamespace()}/gitsources`;
    if (!this.state.gitRepoUrlError && this.state.lastEnteredGitUrl !== this.state.gitRepoUrl) {
      if (this.state.gitSourceCreated) {
        k8sUpdate(GitSourceModel, this._gitSourceParams(this.state.gitSourceName)).then(
          (res) => {
            this.setState({
              resourceVersion: res.metadata.resourceVersion,
              lastEnteredGitUrl: this.state.gitRepoUrl,
            });
          },

          (err) =>
            this.setState({
              gitSourceCreated: false,
              gitRepoUrlError: err.message,
            }),
        );
      } else {
        k8sCreate(
          GitSourceModel,
          this._gitSourceParams(
            `${getActiveNamespace()}-${this._lastSegmentUrl()}-${this.randomString}`,
          ),
        ).then(
          (res) => {
            this.setState({
              resourceVersion: res.metadata.resourceVersion,
              gitSourceCreated: true,
              gitSourceName: `${getActiveNamespace()}-${this._lastSegmentUrl()}-${
                this.randomString
              }`,
              lastEnteredGitUrl: this.state.gitRepoUrl,
            });
          },

          (err) =>
            this.setState({
              gitSourceCreated: false,
              gitRepoUrlError: err.message,
            }),
        );
      }
      if (this.state.gitSourceCreated && this.detectGitType() !== '') {
        this.setState({ gitType: this.detectGitType() });
      }
    }
  }

  detectGitType = (): string => {
    if (this.state.gitRepoUrl.includes('github.com')) {
      return 'github';
    } else if (this.state.gitRepoUrl.includes('bitbucket.org')) {
      return 'bitbucket';
    } else if (this.state.gitRepoUrl.includes('gitlab.com')) {
      return 'gitlab';
    }
    return '';
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // const form = event.currentTarget;
    if (this.state.applicationName === '') {
      this.setState({ applicationNameError: 'Please select the application name' });
    } else {
      this.setState({ applicationNameError: '' });
    }

    if (this.state.builderImage === '') {
      this.setState({ builderImageError: 'Please select the builder image' });
    } else {
      this.setState({ builderImageError: '' });
    }
  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.state.gitSourceCreated) {
      k8sKill(GitSourceModel, this._gitSourceParams(this.state.gitSourceName), {}, {});
    }
    this.setState(initialState);
    history.goBack();
  }

  autocompleteFilter = (text, item) => fuzzy(text, item);

  render() {
    const {
      gitType,
      gitRepoUrl,
      applicationName,
      name,
      builderImage,
      // gitTypeError,
      gitRepoUrlError,
      applicationNameError,
      // nameError,
      builderImageError,
    } = this.state;
    const { namespace } = this.props;
    const namespaces = {};
    namespaces[''] = 'Choose project name';
    namespace.data.forEach(ns => namespaces[ns.metadata.name] = ns.metadata.name);
    let gitTypeField;

    if (gitType) {
      gitTypeField = <FormGroup controlId="import-git-type">
        <ControlLabel className="co-required">Git Type</ControlLabel>
        <Dropdown
          dropDownClassName="dropdown--full-width"
          items={this.gitTypes}
          selectedKey={gitType}
          title={this.gitTypes[gitType]}
          onChange={this.handleGitTypeChange} />
      </FormGroup>;
    }

    return (
      <Form
        data-test-id="import-form"
        onSubmit={this.handleSubmit}
        className="co-m-pane__body-group co-m-pane__form">
        <FormGroup controlId="import-git-repo-url" className={gitRepoUrlError ? 'has-error' : ''}>
          <ControlLabel className="co-required">Git Repository URL</ControlLabel>
          <FormControl
            type="text"
            required
            value={gitRepoUrl}
            onChange={this.handleGitRepoUrlChange}
            onBlur={this.validateGitRepo}
            id="import-git-repo-url"
            data-test-id="import-git-repo-url"
            name="gitRepoUrl" />
          <HelpBlock>{ gitRepoUrlError ? gitRepoUrlError : 'Some helper text' }</HelpBlock>
        </FormGroup>
        { gitTypeField }
        <FormGroup controlId="import-application-name" className={applicationNameError ? 'has-error' : ''}>
          <ControlLabel className="co-required">Application Name</ControlLabel>
          <Dropdown
            dropDownClassName="dropdown--full-width"
            items={namespaces}
            selectedKey={applicationName}
            title={namespaces[applicationName]}
            onChange={this.handleApplicationNameChange}
            autocompleteFilter={this.autocompleteFilter}
            autocompletePlaceholder={'Select application name'}
            data-test-id="import-application-name" />
          <HelpBlock>
            { applicationNameError ? applicationNameError : 'Some help text with explanation' }
          </HelpBlock>
        </FormGroup>
        <FormGroup controlId="import-name">
          <ControlLabel className="co-required">Name</ControlLabel>
          <FormControl
            value={name}
            onChange={this.handleNameChange}
            required
            type="text"
            id="import-name"
            name="name"
            data-test-id="import-name" />
          <HelpBlock>
            Identifies the resources created for this application
          </HelpBlock>
        </FormGroup>
        <FormGroup controlId="import-builder-image" className={builderImageError ? 'has-error' : ''}>
          <ControlLabel className="co-required">Builder Image</ControlLabel>
          <Dropdown
            dropDownClassName="dropdown--full-width"
            items={this.builderImages}
            selectedKey={builderImage}
            title={this.builderImages[builderImage]}
            onChange={this.handleBuilderImageChange}
            data-test-id="import-builder-image" />
          <HelpBlock>
            { builderImageError ? builderImageError : 'Some help text with explanation' }
          </HelpBlock>
        </FormGroup>
        <div className="co-m-btn-bar">
          <Button type="submit" bsStyle="primary">Create</Button>
          <Button type="button" onClick={this.handleCancel}>Cancel</Button>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    namspace: state.k8s.projects,
  };
};
export default connect(mapStateToProps)(ImportFlowForm);
