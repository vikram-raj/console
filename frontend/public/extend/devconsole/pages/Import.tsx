import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { ImportFlow } from '../components/import/ImportFlow';
import { PageHeading } from '../../../components/utils';
import './Import.scss';

const ImportPage: React.FunctionComponent = () => (
  <PageSection variant={PageSectionVariants.light}>
    <Helmet>
      <title>Import from git</title>
    </Helmet>
    <PageHeading title="Git Import" />
    <div className="odc-import-page-wrapper">
      <ImportFlow />
    </div>
  </PageSection>
);

export default ImportPage;
