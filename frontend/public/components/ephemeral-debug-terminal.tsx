import type { FC, ReactNode } from 'react';
import { Alert } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PodConnectLoader } from '@console/internal/components/pod';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { LoadingBox } from '@console/internal/components/utils/status-box';
import type { PodKind } from '../module/k8s';
import { getEphemeralContainerStatus } from '../module/k8s/ephemeral-containers';

const EphemeralDebugTerminalError: FC<EphemeralDebugTerminalErrorProps> = ({
  error,
  description,
}) => (
  <Alert isInline title={error} variant="danger">
    {description}
  </Alert>
);

export const EphemeralDebugTerminalPage: FC = () => {
  const { t } = useTranslation('public');
  const { ns, podName, name } = useParams();
  const [pod, loaded, loadError] = useK8sWatchResource<PodKind>({
    isList: false,
    kind: 'Pod',
    name: podName,
    namespace: ns,
  });

  if (!loaded) {
    return <LoadingBox />;
  }
  if (loadError) {
    return <EphemeralDebugTerminalError error={loadError.message} />;
  }
  if (!pod) {
    return <LoadingBox />;
  }

  const status = getEphemeralContainerStatus(pod, name);
  if (status?.state?.terminated) {
    return (
      <EphemeralDebugTerminalError
        error={t('The debug container failed to start.')}
        description={status.state.terminated.message || status.state.terminated.reason}
      />
    );
  }
  if (!status?.state?.running) {
    return <LoadingBox>{t('Starting debug container')}</LoadingBox>;
  }

  return (
    <PodConnectLoader
      attach
      initialContainer={name}
      infoMessage={
        <Alert
          isInline
          title={t(
            'Connected to an ephemeral debug container. It remains on this pod after you close the terminal.',
          )}
          variant="info"
        />
      }
      obj={pod}
    />
  );
};

interface EphemeralDebugTerminalErrorProps {
  error: ReactNode;
  description?: string;
}
