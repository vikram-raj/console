import * as React from 'react';
import { match as RMatch } from 'react-router';
import { SilencesDetailsPage } from '@console/internal/components/monitoring/alerting';
import NamespacedPage, { NamespacedPageVariants } from '../../NamespacedPage';
import { handleNamespaceChange } from './monitoring-alerts-utils';

export type MonitoringSilenceDetailsPageProps = {
  match: RMatch<{
    ns?: string;
  }>;
};

const MonitoringSilenceDetailsPage: React.FC<MonitoringSilenceDetailsPageProps> = ({ match }) => {
  return (
    <NamespacedPage
      variant={NamespacedPageVariants.light}
      hideApplications
      onNamespaceChange={handleNamespaceChange}
    >
      <SilencesDetailsPage match={match} />
    </NamespacedPage>
  );
};

export default MonitoringSilenceDetailsPage;
