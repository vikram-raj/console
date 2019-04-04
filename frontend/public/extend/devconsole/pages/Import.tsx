import * as React from 'react';
import { ImportFlow } from './../components/import/import-flow';
import './import.scss';

const ImportPage: React.SFC = () => (
  <div className='import-container'>
    <ImportFlow />
  </div>
);

export default ImportPage;
