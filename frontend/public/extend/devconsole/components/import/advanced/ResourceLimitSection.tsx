import * as React from 'react';
import { useFormikContext, FormikValues } from '../../../../../../node_modules/formik';
import FormSection from '../section/FormSection';
import ResourceLimitField from '../../formik-fields/ResourceLimitField';

const ResourceLimitSection: React.FC = () => {
  const { setFieldValue } = useFormikContext<FormikValues>();
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

  const onCpuRequestChange = (value, unit) => {
    console.log(value, unit, '####-1');
    setFieldValue('resourceLimit.cpuRequest.request', value);
    setFieldValue('resourceLimit.cpuRequest.requestUnit', unit);
  }

  const onCpuLimitChange = (value, unit) => {

  }

  const onMemoryRequestChange = (value, unit) => {

  }

  const onMemoryLimitChange = (value, unit) => {

  }

  return (
    <FormSection
      title="Resource Limit"
      divider
    >
    <div className="co-section-heading-tertiary">CPU</div>
    <ResourceLimitField
      name="resourceLimit.cpuRequest.request"
      unitName="resourceLimit.cpuRequest.requestUnit"
      inputLabel="Request"
      unitLabel="Unit"
      unititems={cpuUnits}
      unitselectedkey={cpuUnits.millicores}
      onChange={onCpuRequestChange}
      helpText="The maximum amout of CPU the container is allowed to use when running."
    />

    <ResourceLimitField
      name="resourceLimit.cpuLimit.limit"
      unitName="resourceLimit.cpuLimit.limitUnit"
      inputLabel="Limit"
      unitLabel="Unit"
      unititems={cpuUnits}
      unitselectedkey={cpuUnits.millicores}
      onChange={onCpuLimitChange}
      helpText="The maximum amount of CPU the container is allowed to use when running."
    />

    <div className="co-section-heading-tertiary">Memory</div>
    <ResourceLimitField
      name="resourceLimit.memoryRequest.request"
      unitName="resourceLimit.memoryRequest.requestLimit"
      inputLabel="Request"
      unitLabel="Unit"
      unititems={memoryUnits}
      unitselectedkey={memoryUnits.MiB}
      spacerBefore={new Set(['MB'])}
      headerBefore={{
        ['MiB']: 'Binary Units',
        ['MB']: 'Decimal Units',
      }}
      onChange={onMemoryRequestChange}
      helpText="The minimum amount of Memory the container is guaranteed."
    />

    <ResourceLimitField
      name="resourceLimit.memoryLimit.limit"
      unitName="resourceLimit.memoryLimit.limitUnit"
      inputLabel="Limit"
      unitLabel="Unit"
      unititems={memoryUnits}
      unitselectedkey={memoryUnits.MiB}
      spacerBefore={new Set(['MB'])}
      headerBefore={{
        ['MiB']: 'Binary Units',
        ['MB']: 'Decimal Units',
      }}
      onChange={onMemoryLimitChange}
      helpText="The maximum amount of Memory the container is allowed to use when running."
    />
    </FormSection>
  );
};

export default ResourceLimitSection;