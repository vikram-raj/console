import { consoleFetchJSON } from '@console/dynamic-plugin-sdk/src/api/console-fetch';
import {
  addEphemeralDebugContainer,
  buildEphemeralDebugContainer,
  DEFAULT_DEBUG_IMAGE,
  getEphemeralContainerStatus,
} from '../ephemeral-containers';
import type { PodKind } from '../types';

jest.mock('@console/dynamic-plugin-sdk/src/api/console-fetch', () => ({
  consoleFetchJSON: jest.fn(),
}));

const pod: PodKind = {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'example', namespace: 'test' },
  spec: { containers: [{ name: 'application', image: 'example/app' }] },
};

describe('ephemeral containers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a debug container with the configured target and default image', () => {
    const container = buildEphemeralDebugContainer('application');

    expect(container).toMatchObject({
      image: DEFAULT_DEBUG_IMAGE,
      targetContainerName: 'application',
      command: ['/bin/sh'],
      stdin: true,
      tty: true,
    });
    expect(container.name).toMatch(/^debug-application-/);
  });

  it('should use a custom image when one is provided', () => {
    const container = buildEphemeralDebugContainer('application', 'quay.io/example/debug');

    expect(container.image).toBe('quay.io/example/debug');
  });

  it('should retain previously created ephemeral containers in the patch', async () => {
    const existing = { name: 'debug-existing', image: 'quay.io/example/debug' };
    const container = buildEphemeralDebugContainer('application');
    jest.mocked(consoleFetchJSON).mockResolvedValue(pod);

    await addEphemeralDebugContainer(
      { ...pod, spec: { ...pod.spec, ephemeralContainers: [existing] } },
      container,
    );

    expect(consoleFetchJSON).toHaveBeenCalledWith(
      '/api/kubernetes/api/v1/namespaces/test/pods/example/ephemeralcontainers',
      'PATCH',
      expect.objectContaining({
        body: JSON.stringify({ spec: { ephemeralContainers: [existing, container] } }),
        headers: expect.objectContaining({
          'Content-Type': 'application/strategic-merge-patch+json',
        }),
      }),
    );
  });

  it('should return the ephemeral container running status', () => {
    const status = {
      name: 'debug-application',
      state: { running: {} },
      ready: true,
      restartCount: 0,
      image: 'quay.io/example/debug',
      imageID: 'sha256:debug',
    };

    expect(
      getEphemeralContainerStatus(
        { ...pod, status: { phase: 'Running', ephemeralContainerStatuses: [status] } },
        status.name,
      ),
    ).toBe(status);
  });

  it('should return no status before the debug container starts', () => {
    expect(getEphemeralContainerStatus(pod, 'debug-application')).toBeUndefined();
  });
});
