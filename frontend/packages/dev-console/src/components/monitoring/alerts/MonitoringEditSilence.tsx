import * as React from 'react';
import { EditSilence } from '@console/internal/components/monitoring/silence-form';
import NamespacedPage, { NamespacedPageVariants } from '../../NamespacedPage';
import { handleNamespaceChange } from './monitoring-alerts-utils';
import { MonitoringSilenceDetailsPageProps } from './MonitoringSilenceDetailsPage';

const MonitoringEditSilence: React.FC<MonitoringSilenceDetailsPageProps> = ({ match }) => (
  <NamespacedPage
    variant={NamespacedPageVariants.light}
    hideApplications
    onNamespaceChange={handleNamespaceChange}
  >
    <EditSilence match={match} />
  </NamespacedPage>
);

export default MonitoringEditSilence;
