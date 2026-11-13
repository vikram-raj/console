import type { FC } from 'react';
import { useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { OverlayComponent } from '@console/dynamic-plugin-sdk/src/app/modal-support/OverlayProvider';
import type { PodKind } from '../module/k8s';
import {
  addEphemeralDebugContainer,
  buildEphemeralDebugContainer,
  DEFAULT_DEBUG_IMAGE,
} from '../module/k8s/ephemeral-containers';
import { resourcePath } from './utils/resource-link';

export interface EphemeralDebugModalProps {
  pod: PodKind;
}

const EphemeralDebugModalContent: FC<EphemeralDebugModalContentProps> = ({ pod, onClose }) => {
  const { t } = useTranslation('public');
  const navigate = useNavigate();
  const [targetContainer, setTargetContainer] = useState(pod.spec.containers[0]?.name ?? '');
  const [image, setImage] = useState(DEFAULT_DEBUG_IMAGE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async () => {
    const debugContainer = buildEphemeralDebugContainer(targetContainer, image);
    setIsSubmitting(true);
    setError(undefined);
    try {
      await addEphemeralDebugContainer(pod, debugContainer);
      onClose();
      navigate(
        `${resourcePath('Pod', pod.metadata.name, pod.metadata.namespace)}/ephemeralcontainers/${debugContainer.name}/debug`,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t('Unable to start debug container.'),
      );
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ModalHeader title={t('Start debug container')} labelId="ephemeral-debug-modal-title" />
      <ModalBody>
        <Alert
          isInline
          isPlain
          title={t('Debug containers cannot be removed after they are added to a pod.')}
          variant="warning"
        />
        {error && <Alert isInline title={error} variant="danger" />}
        <Form
          id="ephemeral-debug-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <FormGroup
            label={t('Target container')}
            fieldId="ephemeral-debug-target-container"
            isRequired
          >
            <FormSelect
              id="ephemeral-debug-target-container"
              value={targetContainer}
              onChange={(_event, value) => setTargetContainer(value)}
            >
              {pod.spec.containers.map((container) => (
                <FormSelectOption
                  key={container.name}
                  value={container.name}
                  label={container.name}
                />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label={t('Debug image')} fieldId="ephemeral-debug-image" isRequired>
            <TextInput
              id="ephemeral-debug-image"
              value={image}
              onChange={(_event, value) => setImage(value)}
              isRequired
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          form="ephemeral-debug-form"
          isDisabled={!targetContainer || !image || isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          variant="primary"
        >
          {t('Start debug container')}
        </Button>
        <Button isDisabled={isSubmitting} onClick={onClose} variant="link">
          {t('Cancel')}
        </Button>
      </ModalFooter>
    </>
  );
};

export const EphemeralDebugModalOverlay: OverlayComponent<EphemeralDebugModalProps> = ({
  pod,
  closeOverlay,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const onClose = () => {
    setIsOpen(false);
    closeOverlay();
  };

  return isOpen ? (
    <Modal
      aria-labelledby="ephemeral-debug-modal-title"
      isOpen
      onClose={onClose}
      variant={ModalVariant.small}
    >
      <EphemeralDebugModalContent pod={pod} onClose={onClose} />
    </Modal>
  ) : null;
};

interface EphemeralDebugModalContentProps {
  pod: PodKind;
  onClose: () => void;
}
