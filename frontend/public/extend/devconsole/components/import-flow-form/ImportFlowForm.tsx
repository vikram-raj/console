import * as React from 'react';
import { connect } from 'react-redux';
import * as fuzzy from 'fuzzysearch';
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock,
  Button
} from 'patternfly-react';
import { Dropdown } from './../../../../../public/components/utils';
import { k8sCreate } from '../../../../../public/module/k8s';
import { GitSourceModel } from '../../../../../public/models';
import './ImportFlowForm.scss';

interface State {
  gitType: string,
  gitRepoUrl: string,
  applicationName: string,
  name: string,
  builderImage: string,
}

interface Props {
  namespace: {
    data: Array<any>,
  }
}

const initialState: State = {
  gitType: '',
  gitRepoUrl: '',
  applicationName: '',
  name: '',
  builderImage: '',
};

class ImportFlowForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  gitTypes = {
    '': 'please choose Git type',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'bitbucket': 'Bitbucket'
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
    this.setState({ gitType: gitType });
  }

  handleGitRepoUrlChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    this.setState({ gitRepoUrl: event.currentTarget.value });
  }

  handleApplicationNameChange = (applicationName: string) => {
    this.setState({ applicationName: applicationName })
  }

  handleNameChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    this.setState({ name: event.currentTarget.value });
  }

  handleBuilderImageChange = (builderImage: string) => {
    this.setState({ builderImage:  builderImage });
  }

  autocompleteFilter = (text, item) => fuzzy(text, item);

  getNameSpace = () => this.props.namespace.data
    .filter(space => space.metadata.uid === this.state.applicationName)
    .map(item => item.metadata.name)[0];

  handleSubmit = (event) => {
    const { builderImage, gitRepoUrl, name, gitType } = this.state;
    const gitSource = {
      apiVersion: 'devconsole.openshift.io/v1alpha1',
      kind: 'GitSource',
      metadata: { name, namespace: this.getNameSpace() },
      spec: { url: gitRepoUrl, buildType: builderImage, gitType },
    };
    k8sCreate(GitSourceModel, gitSource)
      .then(() => this.setState(initialState))
      .catch(error => console.error( error));
    event.preventDefault();
  };

  render() {
    const { gitType, gitRepoUrl, applicationName, name, builderImage } = this.state;
    const { namespace } = this.props;
    const namespaces = {};
    namespaces[''] = 'Choose project name';
    namespace.data.forEach(ns => namespaces[ns.metadata.uid] = ns.metadata.name);
    return (
      <div className='odc-import-flow-form'>
        <p>
          Some help text about the section lorem ipsum
        </p>
        <Form onSubmit={this.handleSubmit} className='co-m-pane__body-group co-m-pane__form'>
          <FormGroup controlId='import-git-repo-url'>
            <ControlLabel className='co-required'>Git Repository URL</ControlLabel>
            <FormControl
              type="text"
              required
              value={ gitRepoUrl }
              onChange={ this.handleGitRepoUrlChange }
              id='import-git-repo-url'
              name='gitRepoUrl' />
            <HelpBlock>
              Some help text with explanation
            </HelpBlock>
          </FormGroup>
          <FormGroup controlId='import-git-type'>
            <ControlLabel className='co-required'>Git Type</ControlLabel>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={this.gitTypes}
              selectedKey={gitType}
              title={this.gitTypes[gitType]}
              onChange={this.handleGitTypeChange} />
          </FormGroup>
          <FormGroup controlId='import-application-name'>
            <ControlLabel className='co-required'>Application Name</ControlLabel>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={namespaces}
              selectedKey={applicationName}
              title={namespaces[applicationName]}
              onChange={this.handleApplicationNameChange}
              autocompleteFilter={this.autocompleteFilter}
              autocompletePlaceholder={'Select application name'} />
            <HelpBlock>
              Some help text with explanation
            </HelpBlock>
          </FormGroup>
          <FormGroup controlId='import-name'>
            <ControlLabel className='co-required'>Name</ControlLabel>
            <FormControl
              value={ name }
              onChange={ this.handleNameChange }
              required
              type='text'
              id='import-name'
              name='name'/>
            <HelpBlock>
              Idenfies the resources created for this application
            </HelpBlock>
          </FormGroup>
          <FormGroup controlId='import-builder-image'>
            <ControlLabel className='co-required'>Builder Image</ControlLabel>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={this.builderImages}
              selectedKey={builderImage}
              title={this.builderImages[builderImage]}
              onChange={this.handleBuilderImageChange} />
          </FormGroup>
          <div className='co-m-btn-bar'>
            <Button type='submit' bsStyle="primary">Create</Button>
            <Button type='button'>Cancel</Button>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(ImportFlowForm);
