/* eslint-disable no-unused-vars, no-undef */
export interface InputFieldProps {
  type?: string;
  name: string;
  label: string;
  helpText?: string;
  required?: boolean;
  onChange?: (event) => void;
  onBlur?: (event) => void;
}

export interface DropdownFieldProps extends InputFieldProps {
  items?: object;
  selectedKey: string;
  title?: React.ReactNode;
  fullWidth?: boolean;
  spacerBefore?: Set<string>;
  headerBefore?: {[key: string]: string};
}

export interface EnvironmentFieldProps extends InputFieldProps {
  obj?: object;
  envPath: Array<string>
}
export interface ResourceLimitFieldProps {
  type?: string;
  name: string;
  unitName: string;
  inputLabel: string;
  unitLabel: string;
  unititems: {[key: string]: string};
  unitselectedkey: string;
  helpText?: string;
  required?: boolean;
  fullWidth?: boolean;
  spacerBefore?: Set<string>;
  headerBefore?: {[key: string]: string};
  onChange?: (value, unit) => void;
  onBlur?: (event) => void;
}
