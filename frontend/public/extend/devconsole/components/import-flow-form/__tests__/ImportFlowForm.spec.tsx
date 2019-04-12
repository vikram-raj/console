import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { ImportFlowForm } from './../ImportFlowForm';

describe('ImportFlowForm: ', () => {
  const props = {
    namespace: {
      data: []
    }
  }

  it('renders', () => {
    const importFlowForm = shallow(<ImportFlowForm {...props} />);

    expect(importFlowForm).toBeTruthy();
  });

  it('update state on Git Repository URL input change', () => {
    const importFlowForm = mount(<ImportFlowForm {...props} />);

    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('change', {
      target: { value: 'https://github.com/vikram-raj/console/tree/import-flow' }
    });

    expect(importFlowForm.state().gitRepoUrl).toBe('https://github.com/vikram-raj/console/tree/import-flow');
  });

  it('detect git type', () => {
    const importFlowForm = mount(<ImportFlowForm {...props} />);
    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('change', {
      target: { value: 'https://github.com/vikram-raj/console/tree/import-flow' }
    });
    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('blur');
    expect(importFlowForm.state().gitType).toBe('github');
  });

  it('validate URL', () => {
    const importFlowForm = mount(<ImportFlowForm {...props} />);
    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('change', {
      target: { value: 'https://github.com/vikram-raj/console/tree/import-flow' }
    });
    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('blur');
    expect(importFlowForm.state().gitRepoUrlError).toBe('');

    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('change', {
      target: { value: 'http://localhost:9000/dev/add' }
    });
    importFlowForm.find('input[data-test-id="import-git-repo-url"]').simulate('blur');
    expect(importFlowForm.state().gitRepoUrlError).toBe('Please enter the valid git URL');
    expect(importFlowForm.state().gitTypeDetected).toBe(false);
  });

  it('update state on name input change', () => {
    const importFlowForm = mount(<ImportFlowForm {...props} />);

    importFlowForm.find('input[data-test-id="import-name"]').simulate('change', {
      target: { value: 'node-app' }
    });

    expect(importFlowForm.state().name).toBe('node-app');
  });
});