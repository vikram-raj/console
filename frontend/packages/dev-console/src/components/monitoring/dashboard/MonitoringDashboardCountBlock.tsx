import * as React from 'react';
import { Bullseye } from '@patternfly/react-core';

const MonitoringDasboardCountBlock = () => {
  return (
    <div className="graph-wrapper">
      <h5 className="graph-title">Stat 0</h5>
      <Bullseye>
        <h1>3</h1>
      </Bullseye>
    </div>
  );
};

export default MonitoringDasboardCountBlock;
