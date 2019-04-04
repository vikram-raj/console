import * as React from 'react';
import { ModelessOverlay, Modal } from 'patternfly-react';
import { ImportFlow } from './../import/import-flow';
import './preview-import.scss';

export class PreviewImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { isOpen } = this.props;
    return (
      <ModelessOverlay
        show={ isOpen }
        bsSize={'lg'}>
        <Modal.Header>
          <Modal.CloseButton
            onClick={() => !isOpen}>
          </Modal.CloseButton>
          <Modal.Title>
            Import from Git
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='preview-import__body'>
            <ImportFlow></ImportFlow>
          </div>
        </Modal.Body>
      </ModelessOverlay>
    )
  }
}


