import * as React from 'react';
import { ModelessOverlay, Modal } from 'patternfly-react';
import ImportFlow from './../import/import-flow';
import './preview-import.scss';
import { Firehose } from './../../../../../public/components/utils';
import { NamespaceModel } from './../../../../../public/models';

export class PreviewImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { isOpen, closeModal } = this.props;
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
          <div className='preview-import__body'>
            <Firehose resources={[{kind: NamespaceModel.kind, prop: 'namespace', isList: true}]}>
              <ImportFlow />
            </Firehose>
          </div>
        </Modal.Body>
      </ModelessOverlay>
    )
  }
}


