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

export class ImportFlow extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      gitType: 'please choose Git type',
      gitRepoUrl: '',
      applicationName: '',
      name: '',
      builderImage: ''
    };
  }

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

  applicationNames = [
    {
      value: '',
      label: 'please application name'
    },
    {
      value: 'application-1',
      label: 'Application 1'
    },
    {
      value: 'application-2',
      label: 'Application 2'
    }
  ]

  render() {
    return (
      <div>
        <div>
          <p>Git</p>
          <p>
            Some help text about the section lorem ipsum
          </p>
        </div>
        <Form isHorizontal>
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
            label='Git Repository URL'
            isRequired
            fieldId='import-git-repo-url'>
            <TextInput
              value={ this.state.gitRepoUrl }
              onChange={ this.handleGitRepoUrlChange }
              isRequired
              type='text'
              id='import-git-repo-url'
              name='gitRepoUrl'/>
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
              {this.applicationNames.map((appName, index) => (
                <FormSelectOption key={index} value={appName.value} label={appName.label} />
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
          <ActionGroup>
            <Button variant='primary'>Create</Button>
            <Button variant='secondary'>Cancel</Button>
          </ActionGroup>
        </Form>
      </div>
    )
  }
}