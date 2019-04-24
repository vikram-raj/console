/* eslint-disable no-undef */
import * as React from 'react';
import { connect } from 'react-redux';
import * as fuzzy from 'fuzzysearch';
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Button } from 'patternfly-react';
import { Dropdown, NsDropdown } from './../../../../../public/components/utils';
import { getActiveNamespace } from '../../../../ui/ui-actions';
import { history } from './../../../../../public/components/utils/router';
import './ImportFlowForm.scss';
import { GitSourceModel } from '../../../../models';
import { k8sCreate } from '../../../../module/k8s';
import { getActiveNamespace } from '../../../../ui/ui-actions';
import { CheckIcon } from '@patternfly/react-icons';

interface State {
  gitType: string,
  gitRepoUrl: string,
  namespace: string,
  name: string,
  builderImage: string,
  gitTypeError: string,
  gitRepoUrlError: string,
  applicationNameError: string,
  nameError: string,
  builderImageError: string,
}

/* interface NameSpace {
  metadata: {
    name: string,
    selfLink: string,
    uid: string,
    resourceVersion: string,
    creationTimestamp: string,
  }
} */

interface Props {
  /* namespace: {
    data: Array<NameSpace>,
  }, */
  activeNamespace : string,
}

const initialState: State = {
  gitType: '',
  gitRepoUrl: '',
  namespace: '',
  name: '',
  builderImage: '',
  gitTypeError: '',
  gitRepoUrlError: '',
  namespaceError: '',
  nameError: '',
  builderImageError: '',
};

export class ImportFlowForm extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      gitType: '',
      gitRepoUrl: '',
      namespace: '',
      name: '',
      builderImage: '',
      gitTypeError: '',
      namespaceError: '',
      nameError: '',
      builderImageError: '',
    };
  }

  private onBrowserClose = event => {
    event.preventDefault();
    if (this.state.gitSourceCreated && !this.state.componentCreated) {
      k8sKill(GitSourceModel, this.gitSourceParams(this.state.gitSourceName), {}, {});
    }
  }

  componentDidMount() {
    const activeNamespace = getActiveNamespace();
    this.setState({ applicationName: activeNamespace});
  }
  gitTypes = {
    '': 'please choose Git type',
    github: 'GitHub',
    gitlab: 'GitLab',
    bitbucket: 'Bitbucket',
  };

  builderImages = {
    '': 'Please choose builder image',
    '.net': '.Net',
    nodejs: 'Node.js',
    perl: 'Perl',
    php: 'PHP',
    python: 'Python',
    ruby: 'Ruby',
    redhatopenjdk8: 'Red Hat OpenJDK 8',
  };

  handleGitTypeChange = (gitType: string) => {
    this.setState({ gitType });
  };

  handleGitRepoUrlChange = (event) => {
    // eslint-disable-next-line prefer-const
    let timeOut;
    this.setState({ gitRepoUrl: event.target.value });
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      if (this.state.gitRepoUrl.length % 3 === 0) {
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        if (!urlRegex.test(this.state.gitRepoUrl)) {
          this.setState({ gitRepoUrlError: 'Please enter the valid git URL',
            gitType: '' });
        } else {
          this.setState({ gitRepoUrlError: '' });
        }
      }
    }, 2000);
  }

  handleApplicationNameChange = (applicationName: string) => {
    this.setState({ applicationName });
  };

  handleNameChange = (event) => {
    this.setState({ name: event.target.value, nameError: '' });
  }

  handleBuilderImageChange = (builderImage: string) => {
    this.setState({ builderImage });
  };

  private generateRandomString() {
    const str = Math.random()
      .toString(16)
      .substring(2, 7);
    return str + str;
  }

  private lastSegmentUrl() {
    return this.state.gitRepoUrl.substr(this.state.gitRepoUrl.lastIndexOf('/') + 1);
  }

  validateGitRepo = (): void => {
    if (!this.state.gitRepoUrlError && this.state.gitRepoUrl !== '') {
      this.setState({ gitType: this.detectGitType() });
    }
  };

  detectGitType = (): string => {
    this.setState({ gitTypeError: '' })
    if (this.state.gitRepoUrl.includes('github.com')) {
      return 'github';
    } else if (this.state.gitRepoUrl.includes('bitbucket.org')) {
      return 'bitbucket';
    } else if (this.state.gitRepoUrl.includes('gitlab.com')) {
      return 'gitlab';
    }
    this.setState({ gitTypeError: 'Not able to detect the git type. Please choose git type' })
    return '';
  }

  disableSubmitButton = ():boolean => {
    return !this.state.gitRepoUrl ||
      !this.state.gitType ||
      !this.state.namespace ||
      !this.state.name ||
      !this.state.builderImage;
  }

  private catalogParams = () => {
    return {
      kind: 'Component',
      apiVersion: 'devconsole.openshift.io/v1alpha1',
      metadata: {
        name: this.state.name,
      },
      spec: {
        buildType: this.state.builderImage,
        gitSourceRef: this.state.gitSourceName,
        port: 8080,
        exposed: true,
      },
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.namespace === '') {
      this.setState({ namespaceError: 'Please select the application name' });
    } else {
      this.setState({ namespaceError: '' });
    }

    if (this.state.builderImage === '') {
      this.setState({ builderImageError: 'Please select the builder image' });
    } else {
      this.setState({ builderImageError: '' });
    }

    if (!this.disableSubmitButton()) {
      GitSourceComponentModel.path = `namespaces/${this.props.activeNamespace}/components`;
      k8sCreate(
        GitSourceComponentModel,
        this.catalogParams(),
      )
        .then(() => {
          this.setState({ componentCreated: true });
          history.push(pathWithPerspective('dev', `/k8s/ns/${this.state.namespace}/topolgy`));
        },
        (err) => {
          this.setState({ nameError: err.message });
        });
    }

  }

  handleCancel = (event) => {
    event.preventDefault();
    if (this.state.gitSourceCreated){
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
      namespace,
      name,
      builderImage,
      gitUrlValidationStatus,
      // gitTypeError,
      gitRepoUrlError,
      namespaceError,
      nameError,
      builderImageError,
    } = this.state;
    let gitTypeField;

    if (gitType || gitTypeError) {
      gitTypeField = <FormGroup controlId="import-git-type" className={ gitTypeError ? 'has-error' : ''}>
        <ControlLabel className="co-required">Git Type</ControlLabel>
        <Dropdown
          dropDownClassName="dropdown--full-width"
          items={this.gitTypes}
          selectedKey={gitType}
          title={this.gitTypes[gitType]}
          onChange={this.handleGitTypeChange} />
        <HelpBlock>{ gitTypeError }</HelpBlock>
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
        <FormGroup controlId="import-application-name" className={namespaceError ? 'has-error' : ''}>
          <ControlLabel className="co-required">Namespace</ControlLabel>
          <NsDropdown
            selectedKey={namespace}
            onChange={this.handleNamespaceChange}
            data-test-id="import-application-name" />
          <HelpBlock>
            { namespaceError ? namespaceError : 'Some help text with explanation' }
          </HelpBlock>
        </FormGroup>
        <FormGroup controlId="import-name" className={nameError ? 'has-error' : ''}>
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
            { nameError ? nameError : 'Identifies the resources created for this application' }
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
          <Button type="submit" bsStyle="primary" className={this.disableSubmitButton() ? 'disabled' : ''}>Create</Button>
          <Button type="button" onClick={this.handleCancel}>Cancel</Button>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // namspace: state.k8s.projects,
    activeNamespace: state.UI.get('activeNamespace'),
  };
};
export default connect(mapStateToProps)(ImportFlowForm);
