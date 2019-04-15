import * as React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { NamespaceBar } from './../../../../public/components/namespace';
import { ImportFlow } from './../components/import/import-flow';
import './import.scss';

const ImportPage: React.FunctionComponent = () => (
  <PageSection variant={PageSectionVariants.light}>
    <NamespaceBar />
    <div className="odc-import-page-wrapper">
      <h1>
        Git import
      </h1>
      <p>
        Some help text about the section lorem ipsum
      </p>
      <ImportFlow />
    </div>
  </PageSection>
);

export default ImportPage;
