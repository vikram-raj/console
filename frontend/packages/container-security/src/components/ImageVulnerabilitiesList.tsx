import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'react-router';
import { MultiListPage } from '@console/internal/components/factory';
import { referenceForModel } from '@console/internal/module/k8s';
import { ImageManifestVulnModel } from '../models';
import { priorityFor } from '../const';
import { ImageManifestVuln } from '../types';
import { imageVulnerabilitiesRowFilters } from './image-vulnerability-utils';
import ImageVulnerabilitiesTable from './ImageVulnerabilitiesTable';

export type ImageVulnerabilitiesListProps = {
  match?: match<{ ns?: string }>;
  obj: ImageManifestVuln;
};

const ImageVulnerabilitiesList: React.FC<ImageVulnerabilitiesListProps> = (props) => {
  const { t } = useTranslation();
  const {
    obj: {
      metadata: { name },
    },
    match: {
      params: { ns: namespace },
    },
  } = props;
  return (
    <MultiListPage
      {...props}
      resources={[
        {
          kind: referenceForModel(ImageManifestVulnModel),
          namespaced: true,
          namespace,
          name,
          isList: false,
          prop: 'imageVulnerabilities',
        },
      ]}
      title={t('container-security~Vulnerabilities')}
      flatten={(resources) => {
        return _.sortBy(
          _.flatten(
            resources?.imageVulnerabilities?.data?.spec.features.map((feature) =>
              feature.vulnerabilities.map((vulnerability) => ({ feature, vulnerability })),
            ),
          ),
          (v: any) => priorityFor(v.vulnerability.severity).index,
        );
      }}
      namespace={namespace}
      canCreate={false}
      showTitle
      textFilter="vulnerability"
      rowFilters={imageVulnerabilitiesRowFilters}
      hideLabelFilter
      ListComponent={ImageVulnerabilitiesTable}
    />
  );
};

export default ImageVulnerabilitiesList;
