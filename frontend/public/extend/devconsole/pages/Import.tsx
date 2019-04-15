import * as React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { NamespaceBar } from './../../../../public/components/namespace';
import { ImportFlow } from './../components/import/import-flow';
import './import.scss';

const ImportPage: React.FunctionComponent = () => (
  <PageSection variant={PageSectionVariants.light}>
    <NamespaceBar />
    <div className="odc-import-page-wrapper">
      <ImportFlow />
    </div>
  </PageSection>
);

export default ImportPage;
