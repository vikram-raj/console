// import * as _ from 'lodash-es';
import * as React from 'react';
import {
  FormGroup,
  TextInput,
  Form,
  FormSelectOption,
  FormSelect,
  ActionGroup,
  Button
} from '@patternfly/react-core';
import { NamespaceModel, ProjectModel } from './../../../../../public/models';
import { connect } from 'react-redux';

class ImportFlow extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      gitType: 'please choose Git type',
      gitRepoUrl: '',
      applicationName: '',
      name: '',
      builderImage: '',
    };
  }

  getModel = (userProjects) => userProjects ? ProjectModel : NamespaceModel;

  handleGitTypeChange = (gitType: string, event) => {
    this.setState({ gitType: gitType });
  }

  handleGitRepoUrlChange = (gitRepoUrl: string) => {
    this.setState({ gitRepoUrl: gitRepoUrl });
  }

  handleApplicationNameChange = (applicationName: string, event) => {
    this.setState({ applicationName: applicationName })
  }

  handleNameChange = (name: string) => {
    this.setState({ name: name });
  }

  handleBuilderImageChange = (builderImage: string) => {
    this.setState({ builderImage:  builderImage });
  }

  handleSubmit = (event) => {
    console.log(this.state);
    event.preventDefault();
  }

  gitTypes = [
    {
      value: '',
      label: 'please choose Git type'
    },
    {
      value: 'github',
      label: 'GitHub'
    },
    {
      value: 'gitlab',
      label: 'GitLab'
    },
    {
      value: 'bitbucket',
      label: 'Bitbucket'
    }
  ];

  builderImages = [
    {
      value: '.net',
      label: '.Net',
    },
    {
      value: 'nodejs',
      label: 'Node.js',
    },
    {
      value: 'perl',
      label: 'Perl',
    },
    {
      value: 'php',
      label: 'PHP',
    },
    {
      value: 'python',
      label: 'Python',
    },
    {
      value: 'ruby',
      label: 'Ruby',
    },
    {
      value: 'redhatopenjdk8',
      label: 'Red Hat OpenJDK 8',
    },
  ];

  render() {
    const { namespace } = this.props;
    return (
      <div>
        <div>
          <p>Git</p>
          <p>
            Some help text about the section lorem ipsum
          </p>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup
            label='Git Repository URL'
            isRequired
            fieldId='import-git-repo-url'>
            <TextInput
              value={ this.state.gitRepoUrl }
              onChange={ this.handleGitRepoUrlChange }
              isRequired
              type='text'
              id='import-git-repo-url'
              name='gitRepoUrl' />
          </FormGroup>
          <FormGroup
            label='Git Type'
            isRequired
            fieldId='import-git-type'
            helperText='Some help text with explanation'>
            <FormSelect
              value={ this.state.gitType }
              name='gitType'
              id='import-git-type'
              onChange={this.handleGitTypeChange}
              >
              {this.gitTypes.map((gitType, index) => (
                <FormSelectOption key={index} value={gitType.value} label={gitType.label} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup
            label='Application Name'
            isRequired
            fieldId='import-application-name'
            helperText='Some helper text'>
            <FormSelect
              value={ this.state.applicationName }
              name='applicationName'
              id='import-application-name'
              onChange={ this.handleApplicationNameChange }>
              {namespace.data.map((ns, index) => (
                <FormSelectOption key={index} value={ns.metadata.uid} label={ns.metadata.name} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup
            label='Name'
            isRequired
            fieldId='import-name'
            helperText='Identifies the resources created for this application'>
            <TextInput
              value={this.state.name}
              onChange={ this.handleNameChange }
              isRequired
              type='text'
              id='import-name'
              name='name'/>
          </FormGroup>
          <FormGroup
            label='Builder Image'
            isRequired
            fieldId='import-builder-image'
            helperText='Some helper text'>
            <FormSelect
              value={ this.state.builderImage }
              name='builderImage'
              id='import-builder-image'
              onChange={ this.handleBuilderImageChange }>
              {this.builderImages.map((builderImage, index) => (
                <FormSelectOption key={index} value={builderImage.value} label={builderImage.label} />
              ))}
            </FormSelect>
          </FormGroup>
          <ActionGroup>
            <Button type="submit" variant='primary'>Create</Button>
            <Button variant='secondary'>Cancel</Button>
          </ActionGroup>
        </Form>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(ImportFlow);