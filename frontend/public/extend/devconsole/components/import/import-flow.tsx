// import * as _ from 'lodash-es';
import * as React from 'react';
import { Button } from '@patternfly/react-core';

export class ImportFlow extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      codeBase: null,
      nameSpace: 'myproject',
      show: false ,
    };
  }

  // Close modal window
  toggleOverlay = (event) => this.setState({show: !this.state.show});

  render() {
    return (
      <div className="modal-body-content">
        <div className="modal-body-inner-shadow-covers">
          <div className="form-group">
            <p>Git</p>
            <span>Some help text about this section. Lorem Ipsum</span>
            <label>Git Type</label>

            <label htmlFor="name">Name </label>
            <input
              className="form-control"
              type="text" id="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gitUrl">Git URL</label>
            <input
              className="form-control"
              type="text"
              id="gitUrl"
            />
          </div>
          <div className="form-group">
            <h1 className="catalog-item-header-pf-title">Authorize</h1>
            <div className="import__auth">
              Authorize us to clone your repo
              <br/>
              <Button>Authorize</Button>
            </div>
          </div>
          <div className="form-group">
            <h1 className="catalog-item-header-pf-title">Select builder image to use</h1>
          </div>
        </div>
      </div>
    )
  }
}