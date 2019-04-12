/* eslint-disable no-undef */
import * as React from 'react';
import { connect } from 'react-redux';
import * as fuzzy from 'fuzzysearch';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock,
  Button,
} from 'patternfly-react';
import { Dropdown } from './../../../../../public/components/utils';
import './ImportFlowForm.scss';

interface State {
  gitType: string,
  gitRepoUrl: string,
  applicationName: string,
  name: string,
  builderImage: string,
  gitTypeError: string,
  gitRepoUrlError: string,
  applicationNameError: string,
  nameError: string,
  builderImageError: string,
  gitTypeDetected: boolean,
}

interface Props {
  namespace: {
    data: Array<any>,
  }
}

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
      gitRepoUrlError: '',
      applicationNameError: '',
      nameError: '',
      builderImageError: '',
      gitTypeDetected: false,
    };
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
    this.setState({ gitRepoUrl: event.target.value });
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

  validateGitRepo = (): void => {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
    if (!urlRegex.test(this.state.gitRepoUrl)) {
      this.setState({ gitRepoUrlError: 'Please enter the valid git URL' });
      this.setState({ gitTypeDetected: false });
    } else {
      this.setState({ gitRepoUrlError: '' });
      this.detectGitType();
    }
  }

  detectGitType = (): void => {
    if (this.state.gitRepoUrl.includes('github.com')) {
      this.setState({ gitType: 'github', gitTypeDetected: true });
    } else if (this.state.gitRepoUrl.includes('bitbucket.org')) {
      this.setState({ gitType: 'bitbucket', gitTypeDetected: true });
    } else if (this.state.gitRepoUrl.includes('gitlab.com')) {
      this.setState({ gitType: 'gitlab', gitTypeDetected: true });
    } else {
      this.setState({ gitType: '', gitTypeDetected: true });
    }
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
      gitTypeDetected,
    } = this.state;
    const { namespace } = this.props;
    const namespaces = {};
    namespaces[''] = 'Choose project name';
    namespace.data.forEach(ns => namespaces[ns.metadata.uid] = ns.metadata.name);
    let gitTypeField;

    if (gitTypeDetected) {
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
      <div>
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
            <Button type="button">Cancel</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    namspace: state.k8s.projects,
  };
};
export default connect(mapStateToProps)(ImportFlowForm);
