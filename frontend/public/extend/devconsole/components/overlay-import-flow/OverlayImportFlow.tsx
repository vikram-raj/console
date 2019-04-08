/* eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { ModelessOverlay, Modal } from 'patternfly-react';
import { ImportFlow } from '../import/import-flow';
import './OverlayImportFlow.scss';

type Props = {
  isOpen: boolean,
  closeModal: () => boolean
}
export const OverlayImportFlow: React.FunctionComponent<Props> = (props: Props) => {

  const { isOpen, closeModal } = props;
  return (
    <ModelessOverlay
      show={ isOpen }
      bsSize={'lg'}>
      <Modal.Header>
        <Modal.CloseButton
          onClick={() => closeModal()}>
        </Modal.CloseButton>
        <Modal.Title>
          Import from Git
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='odc-overlay-import__modal-body'>
          <ImportFlow />
        </div>
      </Modal.Body>
    </ModelessOverlay>
  )
}


