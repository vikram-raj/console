import * as React from 'react';
import { CreateSilence } from '@console/internal/components/monitoring/silence-form';
import NamespacedPage, { NamespacedPageVariants } from '../../NamespacedPage';
import { handleNamespaceChange } from './monitoring-alerts-utils';
import { MonitoringSilenceDetailsPageProps } from './MonitoringSilenceDetailsPage';

const MonitoringCreateSilence: React.FC<MonitoringSilenceDetailsPageProps> = ({ match }) => (
  <NamespacedPage
    variant={NamespacedPageVariants.light}
    hideApplications
    onNamespaceChange={handleNamespaceChange}
  >
    <CreateSilence match={match} />
  </NamespacedPage>
);

export default MonitoringCreateSilence;
