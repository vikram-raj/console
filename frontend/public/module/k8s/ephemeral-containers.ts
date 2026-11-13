import { consoleFetchJSON } from '@console/dynamic-plugin-sdk/src/api/console-fetch';
import { resourceURL } from '@console/dynamic-plugin-sdk/src/utils/k8s/k8s-utils';
import { PodModel } from '../../models';
import type { EphemeralContainer, PodKind } from './types';

export const DEFAULT_DEBUG_IMAGE = 'registry.redhat.io/rhel9/support-tools';

const getDebugContainerName = (targetContainer: string) => {
  const suffix = Date.now().toString(36);
  const prefix = `debug-${targetContainer}`.slice(0, 63 - suffix.length - 1).replace(/-$/, '');
  return `${prefix}-${suffix}`;
};

export const buildEphemeralDebugContainer = (
  targetContainer: string,
  image = DEFAULT_DEBUG_IMAGE,
): EphemeralContainer => ({
  name: getDebugContainerName(targetContainer),
  image,
  targetContainerName: targetContainer,
  command: ['/bin/sh'],
  stdin: true,
  tty: true,
});

export const addEphemeralDebugContainer = (
  pod: PodKind,
  container: EphemeralContainer,
): Promise<PodKind> => {
  const patch = {
    spec: {
      ephemeralContainers: [...(pod.spec.ephemeralContainers ?? []), container],
    },
  };

  return consoleFetchJSON(
    resourceURL(PodModel, {
      ns: pod.metadata.namespace,
      name: pod.metadata.name,
      path: 'ephemeralcontainers',
    }),
    'PATCH',
    {
      body: JSON.stringify(patch),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/strategic-merge-patch+json',
      },
    },
  );
};

export const getEphemeralContainerStatus = (pod: PodKind, name: string) =>
  pod.status?.ephemeralContainerStatuses?.find((status) => status.name === name);
