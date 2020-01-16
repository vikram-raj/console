import * as React from 'react';
import * as _ from 'lodash';
import { Grid, GridItem } from '@patternfly/react-core';
import { K8sResourceKind, PodKind } from '@console/internal/module/k8s';
import { requirePrometheus } from '@console/internal/components/graphs';
import MonitoringDashboardGraph from '../dashboard/MonitoringDashboardGraph';
import { workloadMetricQueries } from './queries';
import MonitoringOverviewSection from './MonitoringOverviewSection';

const WorkloadGraphs = requirePrometheus(({ deployment }) => {
  const ns = deployment.metadata.namespace;
  const workloadName = deployment.metadata.name;
  const workloadType = deployment.kind.toLowerCase();
  return (
    <>
      <Grid className="co-m-pane__body">
        {_.map(workloadMetricQueries, (q, i) => (
          <GridItem span={12} key={i}>
            <MonitoringDashboardGraph
              title={q.title}
              namespace={ns}
              graphType={q.chartType}
              query={q.query({ ns, workloadName, workloadType })}
              humanize={q.humanize}
              byteDataType={q.byteDataType}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
});

const MonitoringMetricsSection: React.FC<MonitoringMetricsSectionProps> = ({
  deployment,
  pods,
}) => {
  return (
    <>
      <MonitoringOverviewSection type="alerts" pods={pods} />
      <h2>Metrics</h2>
      <WorkloadGraphs deployment={deployment} />
      <MonitoringOverviewSection type="events" pods={pods} />
    </>
  );
};

type MonitoringMetricsSectionProps = {
  deployment: K8sResourceKind;
  pods: PodKind[];
};

export default MonitoringMetricsSection;
