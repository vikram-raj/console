import * as React from 'react';
import { connect } from 'react-redux';
import * as fuzzy from 'fuzzysearch';
import { Dropdown } from './../../../../../public/components/utils';
import './ImportFlowForm.scss'

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

class ImportFlowForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      gitType: '',
      gitRepoUrl: '',
      applicationName: '',
      name: '',
      builderImage: '',
    };
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

  handleSubmit = (event) => {
    console.log(this.state);
    event.preventDefault();
  }

  autocompleteFilter = (text, item) => fuzzy(text, item);

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
        <form onSubmit={this.handleSubmit} name="form" className="co-m-pane__body-group co-m-pane__form">
          <div className='form-group'>
            <label className='control-label co-required' htmlFor='import-git-repo-url'>Git Repository URL</label>
            <input
              className='form-control'
              value={ gitRepoUrl }
              onChange={ this.handleGitRepoUrlChange }
              required
              type='text'
              id='import-git-repo-url'
              name='gitRepoUrl' />
          </div>
          <div className='form-group'>
            <label className='control-label co-required' htmlFor='import-git-type'>Git Type</label>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={this.gitTypes}
              selectedKey={gitType}
              title={this.gitTypes[gitType]}
              onChange={this.handleGitTypeChange} />
          </div>
          <div className='form-group'>
            <label className='control-label co-required' htmlFor='import-application-name'>Application Name</label>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={namespaces}
              selectedKey={applicationName}
              title={namespaces[applicationName]}
              onChange={this.handleApplicationNameChange}
              autocompleteFilter={this.autocompleteFilter}
              autocompletePlaceholder={'Select application name'} />
          </div>
          <div className='form-group'>
            <label className='control-label co-required' htmlFor='import-name'>Name</label>
            <input
              className='form-control'
              value={ name }
              onChange={ this.handleNameChange }
              required
              type='text'
              id='import-name'
              name='name'/>
          </div>
          <div className='form-group'>
            <label className='control-label co-required' htmlFor='import-builder-image'>Builder Image</label>
            <Dropdown
              dropDownClassName='dropdown--full-width'
              items={this.builderImages}
              selectedKey={builderImage}
              title={this.builderImages[builderImage]}
              onChange={this.handleBuilderImageChange} />
          </div>
          <div className='co-m-btn-bar'>
            <button type='submit' className="btn btn-primary">Create</button>
            <button type='button' className="btn btn-default">Cancel</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(ImportFlowForm);