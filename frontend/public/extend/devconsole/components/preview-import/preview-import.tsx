import * as React from 'react';
import { ModelessOverlay, Modal } from 'patternfly-react';
import { ImportFlow } from './../import/import-flow';

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
          <ImportFlow></ImportFlow>
        </Modal.Body>
      </ModelessOverlay>
    )
  }
}


