import * as React from 'react';
import * as _ from 'lodash';
import { ListItem } from '@patternfly/react-core';
import { BootableDeviceType } from '../../types';
import { deviceLabel, deviceKey } from './constants';
import { BootOrderSummaryEmptyState } from './boot-order-summary-empty-state';

// NOTE(yaacov): using <ol> because '@patternfly/react-core' <List> currently miss isOrder parameter.
export const BootOrderSummary = ({ devices }) => {
  const sources = _.sortBy(devices.filter((device) => device.value.bootOrder), 'value.bootOrder');

  return (
    <>
      {sources.length === 0 ? (
        <BootOrderSummaryEmptyState devices={devices} />
      ) : (
        <ol>
          {sources.map((source) => (
            <ListItem key={deviceKey(source)}>{deviceLabel(source)}</ListItem>
          ))}
        </ol>
      )}
    </>
  );
};

export type BootOrderSummaryProps = {
  devices: BootableDeviceType[];
};
