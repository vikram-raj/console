import * as React from 'react';
import { Firehose } from '../../../../components/utils';
import { NamespaceModel } from '../../../../models';
import ImportFlowForm from '../import-flow-form/ImportFlowForm';
import './import-flow.scss';

export const ImportFlow: React.FunctionComponent = () => {

  return (
    <div>
      <h1>
        Git import
      </h1>
      <p>
        Some help text about the section lorem ipsum
      </p>
      <Firehose resources={[{kind: NamespaceModel.kind, prop: 'namespace', isList: true}]}>
        <ImportFlowForm />
      </Firehose>
    </div>
  );
};
