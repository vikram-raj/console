import * as React from 'react';
import { ImportFlow } from './../components/import/import-flow';
import './import.scss';

const ImportPage: React.SFC = () => (
  <div className='odc-import-container'>
    <ImportFlow />
  </div>
);

export default ImportPage;
