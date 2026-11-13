import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Action } from '@console/dynamic-plugin-sdk';
import { useOverlay } from '@console/dynamic-plugin-sdk/src/app/modal-support/useOverlay';
import { EphemeralDebugModalOverlay } from '@console/internal/components/ephemeral-debug-modal';
import { asAccessReview } from '@console/internal/components/utils/rbac';
import { PodModel } from '@console/internal/models';
import { referenceFor } from '@console/internal/module/k8s';
import type { K8sResourceKind, PodKind } from '@console/internal/module/k8s';
import { isWindowsPod } from '@console/internal/module/k8s/pods';
import { useK8sModel } from '@console/shared/src/hooks/useK8sModel';
import { useCommonResourceActions } from '../hooks/useCommonResourceActions';

export const usePodActionsProvider = (resource: K8sResourceKind) => {
  const { t } = useTranslation('console-app');
  const launchModal = useOverlay();
  const [kindObj, inFlight] = useK8sModel(referenceFor(resource));
  const commonActions = useCommonResourceActions(kindObj, resource);

  const actions = useMemo(() => {
    const pod = resource as PodKind;
    if (pod.status?.phase !== 'Running' || isWindowsPod(pod)) {
      return commonActions;
    }

    const debugAction: Action = {
      id: 'start-debug-container',
      label: t('Debug'),
      cta: () => launchModal(EphemeralDebugModalOverlay, { pod }),
      accessReview: asAccessReview(PodModel, pod, 'patch', 'ephemeralcontainers'),
    };
    return [debugAction, ...commonActions];
  }, [commonActions, launchModal, resource, t]);

  return [actions, !inFlight, undefined];
};
