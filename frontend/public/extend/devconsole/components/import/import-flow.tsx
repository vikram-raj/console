import * as React from 'react';
import { Firehose } from '../../../../components/utils';
import { NamespaceModel } from '../../../../models';
import ImportFlowForm from '../import-flow-form/ImportFlowForm';
import './import-flow.scss';

export const ImportFlow: React.FunctionComponent = () => {

  return (
    <Firehose resources={[{kind: NamespaceModel.kind, prop: 'namespace', isList: true}]}>
      <ImportFlowForm />
    </Firehose>
  );
};
