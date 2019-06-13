/* eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import * as _ from 'lodash-es';
import cx from 'classnames';
import { useField, useFormikContext, FormikValues } from 'formik';
import { FormGroup, ControlLabel, HelpBlock } from 'patternfly-react';
import { getValidationState } from './field-utils';
import { ResourceLimitFieldProps } from './field-types';
import { NumberSpinner, Dropdown } from '../../../../components/utils';
import { convertValueToBase } from '../import/import-validation-utils';

const ResourceLimitField: React.FC<ResourceLimitFieldProps> = ({ inputLabel, unitLabel, name, unitName, helpText, ...props }) => {
  const [field, { touched, error }] = useField(name);
  const [unitField] = useField(unitName);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();

  const onSpinnerChange = (operation: number) => {
    setFieldValue(name, _.toInteger(field.value) + operation);
    setFieldTouched(name, true);
    // props.onChange(field.value, unitField.value);
    console.log(field.value, unitField.value);
    console.log(convertValueToBase(field.value, props.unitselectedkey), '###');
  }

  const unitDropDownChange = (unit: string) => {
    setFieldValue(unitName, unit)
    // props.onChange(field.value, unit);
    console.log(unit, field.value);
  }

  return (
    <FormGroup
      controlId={`${name}-field`}
      validationState={getValidationState(error, touched)}
    >
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-7">
          <ControlLabel className={cx({ 'co-required': props.required })}>
            {inputLabel}
          </ControlLabel>
          <NumberSpinner
            {...field}
            {...props}
            changeValueBy={onSpinnerChange}
            aria-describedby={`${name}-help`}
          />
        </div>
        <div className="col-lg-8 col-md-8 col-sm-6 col-xs-5">
          <ControlLabel className={cx({ 'co-required': props.required })}>
            {unitLabel}
          </ControlLabel>
          <Dropdown
            id={`${unitName}-field`}
            {...field}
            {...props}
            items={props.unititems}
            selectedKey={props.unitselectedkey}
            dropDownClassName={cx({ 'dropdown--full-width': props.fullWidth })}
            onChange={unitDropDownChange}
            onBlur={() => setFieldTouched(unitName, true)}
          />
        </div>
      </div>
      {helpText && <HelpBlock id={`${name}-help`}>{helpText}</HelpBlock>}
      {touched && error && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>
  );
};

export default ResourceLimitField;
