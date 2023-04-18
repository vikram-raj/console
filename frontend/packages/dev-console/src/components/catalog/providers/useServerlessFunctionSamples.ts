import * as React from 'react';
import { TFunction } from 'i18next';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { ExtensionHook, CatalogItem } from '@console/dynamic-plugin-sdk';
import {
  getImageForIconClass,
  getImageStreamIcon,
} from '@console/internal/components/catalog/catalog-item-icon';
import {
  getMostRecentBuilderTag,
  isServerlessBuilder,
} from '@console/internal/components/image-stream';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { ANNOTATIONS } from '@console/shared';
import { prettifyName } from '../../../utils/imagestream-utils';

const normalizeBuilderImages = (
  builderImageStreams: K8sResourceKind[],
  activeNamespace: string,
  t: TFunction,
): CatalogItem[] => {
  const normalizedBuilderImages = _.map(builderImageStreams, (imageStream) => {
    const { uid, name, namespace: imageStreamNS, annotations } = imageStream.metadata;
    const tag = getMostRecentBuilderTag(imageStream);
    const displayName = tag?.annotations?.['serverlessFuncSampleName'] ?? name;
    const title = displayName && displayName.length < 14 ? displayName : prettifyName(displayName);
    const icon = getImageStreamIcon(tag);
    const imgUrl = getImageForIconClass(icon);
    const iconClass = imgUrl ? null : icon;
    const description = tag?.['annotations']?.['serverlessFuncSampleDescription'] ?? '';
    const provider = annotations?.[ANNOTATIONS.providerDisplayName] ?? '';
    const creationTimestamp = imageStream.metadata?.creationTimestamp;
    const href = `/samples/ns/${activeNamespace}/${name}/${imageStreamNS}?type=ServerlessFunction`;
    const createLabel = t('devconsole~Create');
    const type = 'ServerlessFunction';

    const item: CatalogItem = {
      uid: `${type}-${uid}-${description}`,
      type,
      name: title,
      provider,
      description,
      creationTimestamp,
      icon: {
        url: imgUrl,
        class: iconClass,
      },
      cta: {
        label: createLabel,
        href,
      },
    };
    return item;
  });

  return normalizedBuilderImages;
};

const useServelessFuncBuilderImageSamples: ExtensionHook<CatalogItem[]> = ({ namespace }) => {
  const { t } = useTranslation();
  const resourceSelector = {
    kind: 'ImageStream',
    namespace: 'openshift',
    isList: true,
  };
  const [imageStreams, loaded, loadedError] = useK8sWatchResource<K8sResourceKind[]>(
    resourceSelector,
  );

  const normalizedBuilderImages = React.useMemo<CatalogItem[]>(() => {
    const filteredImageStreams = imageStreams.filter((imageStream) => {
      const recentTag = getMostRecentBuilderTag(imageStream);
      const serverlessFuncSampleRepo = recentTag?.annotations?.['serverlessFuncSampleRepo'];
      return isServerlessBuilder(imageStream) && serverlessFuncSampleRepo;
    });
    return normalizeBuilderImages(filteredImageStreams, namespace, t);
  }, [t, namespace, imageStreams]);

  return [normalizedBuilderImages, loaded, loadedError];
};

export default useServelessFuncBuilderImageSamples;
