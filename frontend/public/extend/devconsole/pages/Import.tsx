import * as React from 'react';
import ImportFlow from './../components/import/import-flow';
import { Firehose } from './../../../../public/components/utils';
import { NamespaceModel } from './../../../../public/models';
import './import.scss';

const ImportPage: React.SFC = () => (
  <div className='odc-import-container'>
    <Firehose resources={[{kind: NamespaceModel.kind, prop: 'namespace', isList: true}]}>
      <ImportFlow />
    </Firehose>
  </div>
);

export default ImportPage;
