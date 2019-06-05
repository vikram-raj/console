/* eslint-disable no-undef, dot-notation */
import * as React from 'react';
import * as _ from 'lodash-es';
import { FormGroup, ControlLabel, HelpBlock } from 'patternfly-react';
import {
  NumberSpinner,
  Dropdown,
  units,
  convertToBaseValue,
} from '../../../../../components/utils';
import './ResourceLimits.scss';

interface ResourceLimitProps {
  cpuRequest?: {
    [key: string]: string | number;
  };
  cpuLimit?: {
    [key: string]: string | number;
  };
  memoryRequest?: {
    [key: string]: string | number;
  };
  memoryLimit?: {
    [key: string]: string | number;
  };
  cpuRequestError?: string;
  cpuLimitError?: string;
  memoryRequestError?: string;
  memoryLimitError?: string;
  onCpuRequestChange?: (cpuRequest?: { [key: string]: string | number }) => void;
  onCpuLimitChange?: (cpuLimit?: { [key: string]: string | number }) => void;
  onMemoryRequestChange?: (memoryRequest?: { [key: string]: string | number }) => void;
  onMemoryLimitChange?: (memoryLimit?: { [key: string]: string | number }) => void;
}

export const isPositive = (value: number) => {
  return value >= 0 ? '' : 'Can\'t be negative.';
};

export const convertValueToBase = (value, unitLabel) => {
  let val: number;
  switch (unitLabel) {
    //millicores
    case 'millicores':
      val = convertToBaseValue(`${value} m`);
      break;
    case 'MiB':
      val = units.dehumanize(`${value}MiB`, 'binaryBytes').value;
      break;
    case 'GiB':
      val = units.dehumanize(`${value}GiB`, 'binaryBytes').value;
      break;
    case 'MB':
      val = units.dehumanize(`${value}MB`, 'decimalBytes').value;
      break;
    case 'GB':
      val = units.dehumanize(`${value}GB`, 'decimalBytes').value;
      break;
    default:
      val = value;
      break;
  }
  return val;
};

export const validateLimit = (min, max, unitOfMin, unitOfMax) => {
  if (isPositive(max) !== '') {
    return isPositive(max);
  }
  const minInBase = convertValueToBase(min, unitOfMin);
  const maxInBase = convertValueToBase(max, unitOfMax);
  if (maxInBase < minInBase) {
    return `Limit can't be less than request (${min} ${unitOfMin}).`;
  }
};

const ResourceLimits: React.FC<ResourceLimitProps> = ({
  cpuRequest,
  cpuLimit,
  memoryRequest,
  memoryLimit,
  cpuRequestError,
  cpuLimitError,
  memoryRequestError,
  memoryLimitError,
  onCpuRequestChange,
  onCpuLimitChange,
  onMemoryRequestChange,
  onMemoryLimitChange,
}) => {
  const cpuUnits: { [key: string]: string } = {
    millicores: 'millicores',
    cores: 'cores',
  };

  const memoryUnits: { [key: string]: string } = {
    MiB: 'MiB',
    GiB: 'GiB',
    MB: 'MB',
    GB: 'GB',
  };

  const defaultUnit: { [key: string]: string } = {
    cpu: cpuUnits.millicores,
    memory: memoryUnits.MiB,
  };

  const firstLabel = 'MiB';
  const secondLabel = 'MB';

  const onChangeCpuRequestData: React.ReactEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value === '' ? 0 : event.currentTarget.valueAsNumber;
    onCpuRequestChange({
      [event.currentTarget.name]: val,
      ['requestUnit']: cpuRequest.requestUnit || defaultUnit.cpu,
    });
  };

  const onChangeCpuLimitData: React.ReactEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value === '' ? 0 : event.currentTarget.valueAsNumber;
    onCpuLimitChange({
      [event.currentTarget.name]: val,
      ['limitUnit']: cpuLimit.limitUnit || defaultUnit.cpu,
    });
  };

  const onChangeMemoryRequestData: React.ReactEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value === '' ? 0 : event.currentTarget.valueAsNumber;
    onMemoryRequestChange({
      [event.currentTarget.name]: val,
      ['requestUnit']: memoryRequest.requestUnit || defaultUnit.memory,
    });
  };

  const onChangeMemoryLimitData: React.ReactEventHandler<HTMLInputElement> = (event) => {
    const val = event.currentTarget.value === '' ? 0 : event.currentTarget.valueAsNumber;
    onMemoryLimitChange({
      [event.currentTarget.name]: val,
      ['limitUnit']: memoryLimit.limitUnit || defaultUnit.memory,
    });
  };

  const onChangeCpuRequest = (operation) => {
    onCpuRequestChange({
      ['request']: _.toInteger(cpuRequest.request) + operation,
      ['requestUnit']: cpuRequest.requestUnit || defaultUnit.cpu,
    });
  };

  const onCpuRequestUnitChange = (val) => {
    onCpuRequestChange({
      ['request']: cpuRequest.request,
      ['requestUnit']: cpuUnits[val],
    });
  };

  const onChangeCpuLimit = (operation) => {
    onCpuLimitChange({
      ['limit']: _.toInteger(cpuLimit.limit) + operation,
      ['limitUnit']: cpuLimit.limitUnit || defaultUnit.cpu,
    });
  };

  const onCpuLimitUnitChange = (val) => {
    onCpuLimitChange({
      ['limit']: cpuLimit.limit,
      ['limitUnit']: cpuUnits[val],
    });
  };

  const onChangeMemoryRequest = (operation) => {
    onMemoryRequestChange({
      ['request']: _.toInteger(memoryRequest.request) + operation,
      ['requestUnit']: memoryRequest.requestUnit || defaultUnit.memory,
    });
  };

  const onMemoryRequestUnitChange = (val) => {
    onMemoryRequestChange({
      ['request']: memoryRequest.request,
      ['requestUnit']: memoryUnits[val],
    });
  };

  const onChangeMemoryLimit = (operation) => {
    onMemoryLimitChange({
      ['limit']: _.toInteger(memoryLimit.limit) + operation,
      ['limitUnit']: memoryLimit.limitUnit || defaultUnit.memory,
    });
  };

  const onMemoryLimitUnitChange = (val) => {
    onMemoryLimitChange({
      ['limit']: memoryLimit.limit,
      ['limitUnit']: memoryUnits[val],
    });
  };

  return (
    <React.Fragment>
      <div className="co-section-heading">Resource Limits</div>
      <div className="co-section-heading-tertiary">CPU</div>
      <FormGroup controlId="cpu-request" className={cpuRequestError ? 'has-error' : ''}>
        <div className="odc-resource-limit-row">
          <div>
            <ControlLabel>Request</ControlLabel>
            <NumberSpinner
              id="cpu-request"
              name="request"
              className="form-control"
              value={cpuRequest.request}
              onChange={onChangeCpuRequestData}
              changeValueBy={onChangeCpuRequest}
            />
          </div>
          <div className="odc-resource-limit-unit">
            <ControlLabel>Unit</ControlLabel>
            <Dropdown
              // className="odc-resource-limits-dropdown"
              dropDownClassName="dropdown--full-width"
              items={cpuUnits}
              selectedKey={cpuUnits.millicores}
              title={cpuUnits.millicores}
              onChange={onCpuRequestUnitChange}
            />
          </div>
        </div>
        <HelpBlock>The minimum amount of CPU the container is guaranteed.</HelpBlock>
        <HelpBlock>{cpuRequestError}</HelpBlock>
      </FormGroup>
      <FormGroup controlId="cpu-limit" className={cpuLimitError ? 'has-error' : ''}>
        <div className="odc-resource-limit-row">
          <div>
            <ControlLabel>Limit</ControlLabel>
            <NumberSpinner
              id="cpu-limit"
              name="limit"
              className="form-control"
              value={cpuLimit.limit}
              onChange={onChangeCpuLimitData}
              changeValueBy={onChangeCpuLimit}
            />
          </div>
          <div className="odc-resource-limit-unit">
            <ControlLabel>Unit</ControlLabel>
            <Dropdown
              // className="odc-resource-limits-dropdown"
              dropDownClassName="dropdown--full-width"
              items={cpuUnits}
              selectedKey={cpuUnits.millicores}
              title={cpuUnits.millicores}
              onChange={onCpuLimitUnitChange}
            />
          </div>
        </div>
        <HelpBlock>
          The maximum amount of CPU the container is allowed to use when running.
        </HelpBlock>
        <HelpBlock>{cpuLimitError}</HelpBlock>
      </FormGroup>
      <div className="co-section-heading-tertiary">Memory</div>
      <FormGroup controlId="memory-request" className={memoryRequestError ? 'has-error' : ''}>
        <div className="odc-resource-limit-row">
          <div>
            <ControlLabel>Request</ControlLabel>
            <NumberSpinner
              id="memory-request"
              name="request"
              className="form-control"
              value={memoryRequest.request}
              onChange={onChangeMemoryRequestData}
              changeValueBy={onChangeMemoryRequest}
            />
          </div>
          <div className="odc-resource-limit-unit">
            <ControlLabel>Unit</ControlLabel>
            <Dropdown
              // className="odc-resource-limits-dropdown"
              dropDownClassName="dropdown--full-width"
              items={memoryUnits}
              selectedKey={memoryUnits.MiB}
              title={memoryUnits.MiB}
              spacerBefore={new Set([secondLabel])}
              headerBefore={{
                [firstLabel]: 'Binary Units',
                [secondLabel]: 'Decimal Units',
              }}
              onChange={onMemoryRequestUnitChange}
            />
          </div>
        </div>
        <HelpBlock>The minimum amount of Memory the container is guaranteed.</HelpBlock>
        <HelpBlock>{memoryRequestError}</HelpBlock>
      </FormGroup>
      <FormGroup controlId="memory-limit" className={memoryLimitError ? 'has-error' : ''}>
        <div className="odc-resource-limit-row">
          <div>
            <ControlLabel>Limit</ControlLabel>
            <NumberSpinner
              id="memory-limit"
              name="limit"
              className="form-control"
              value={memoryLimit.limit}
              onChange={onChangeMemoryLimitData}
              changeValueBy={onChangeMemoryLimit}
            />
          </div>
          <div className="odc-resource-limit-unit">
            <ControlLabel>Unit</ControlLabel>
            <Dropdown
              // className="odc-resource-limits-dropdown"
              dropDownClassName="dropdown--full-width"
              items={memoryUnits}
              selectedKey={memoryUnits.MiB}
              title={memoryUnits.MiB}
              spacerBefore={new Set([secondLabel])}
              headerBefore={{
                [firstLabel]: 'Binary Units',
                [secondLabel]: 'Decimal Units',
              }}
              onChange={onMemoryLimitUnitChange}
            />
          </div>
        </div>
        <HelpBlock>
          The maximum amount of Memory the container is allowed to use when running.
        </HelpBlock>
        <HelpBlock>{memoryLimitError}</HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
};

export default ResourceLimits;
