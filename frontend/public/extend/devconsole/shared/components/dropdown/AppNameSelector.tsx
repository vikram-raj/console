/* eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'patternfly-react';
import AppDropdown from './AppDropdown';

const CREATE_APPLICATION_KEY = 'create-application-key';

interface AppNameSelectorProps {
  namespace?: string;
  application: string;
  selectedKey: string;
  onChange?: (arg0: string, arg1: string) => void;
}

const AppNameSelector: React.FC<AppNameSelectorProps> = ({
  application,
  namespace,
  selectedKey,
  onChange,
}) => {
  const onDropdownChange = (application: string, selectedKey: string) => {
    if (selectedKey === CREATE_APPLICATION_KEY) {
      onChange('', selectedKey);
    } else {
      onChange(application, selectedKey);
    }
  };

  const onInputChange: React.ReactEventHandler<HTMLInputElement> = (event) => {
    onChange(event.currentTarget.value, selectedKey);
  };

  return (
    <React.Fragment>
      <FormGroup>
        <ControlLabel className="co-required">Application</ControlLabel>
        <AppDropdown
          namespace={namespace}
          actionItem={{
            actionTitle: 'Create New Application',
            actionKey: CREATE_APPLICATION_KEY,
          }}
          selectedKey={selectedKey}
          onChange={onDropdownChange}
        />
      </FormGroup>
      {selectedKey === CREATE_APPLICATION_KEY ? (
        <FormGroup>
          <ControlLabel className="co-required">Application Name</ControlLabel>
          <FormControl
            className="form-control"
            type="text"
            onChange={onInputChange}
            value={application}
            id="app-name"
            aria-describedby="name-help"
            required
          />
          <HelpBlock>Names the application</HelpBlock>
        </FormGroup>
      ) : null}
    </React.Fragment>
  );
};

export default AppNameSelector;
