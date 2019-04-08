import * as React from 'react';
import { ModelessOverlay, Modal } from 'patternfly-react';
import ImportFlow from '../import/import-flow';
import { Firehose } from '../../../../components/utils';
import { NamespaceModel } from '../../../../models';
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
          <Firehose resources={[{kind: NamespaceModel.kind, prop: 'namespace', isList: true}]}>
            <ImportFlow />
          </Firehose>
        </div>
      </Modal.Body>
    </ModelessOverlay>
  )
}


