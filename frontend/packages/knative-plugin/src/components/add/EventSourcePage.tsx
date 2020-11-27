import * as React from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageBody } from '@console/shared';
import { LoadingInline, PageHeading } from '@console/internal/components/utils';
import NamespacedPage, {
  NamespacedPageVariants,
} from '@console/dev-console/src/components/NamespacedPage';
import { QUERY_PROPERTIES } from '@console/dev-console/src/const';
import ConnectedEventSource from './EventSource';
import EventSourceAlert from './EventSourceAlert';
import { useEventSourceList, useGetKamelet } from '../../utils/create-eventsources-utils';
import { isDynamicEventSourceKind } from '../../utils/fetch-dynamic-eventsources-utils';

type EventSourcePageProps = RouteComponentProps<{ ns?: string }>;

const EventSourcePage: React.FC<EventSourcePageProps> = ({ match, location }) => {
  const { t } = useTranslation();
  const namespace = match.params.ns;
  const eventSourceStatus = useEventSourceList(namespace);
  const searchParams = new URLSearchParams(location.search);
  const showCatalog = location.pathname.includes('/extensible-catalog/');
  const sourceKindProp = showCatalog && searchParams.get('sourceKind');
  const kameletName = showCatalog && sourceKindProp && searchParams.get('kameletName');
  const [kamelet, kameletLoaded] = useGetKamelet(kameletName, namespace);
  const isSourceKindPresent =
    (sourceKindProp && isDynamicEventSourceKind(sourceKindProp)) || (kameletName && kameletLoaded);
  return (
    <NamespacedPage disabled variant={NamespacedPageVariants.light}>
      <Helmet>
        <title>{t('knative-plugin~Event Source')}</title>
      </Helmet>
      <PageHeading
        title={
          sourceKindProp
            ? t('knative-plugin~Create Event Source')
            : t('knative-plugin~Event Source')
        }
      >
        {sourceKindProp
          ? t(
              'knative-plugin~Create an event source to register interest in a class of events from a particular system. Configure using the YAML and form views.',
            )
          : t(
              'knative-plugin~Create an event source to register interest in a class of events from a particular system',
            )}
      </PageHeading>
      <PageBody flexLayout>
        <EventSourceAlert
          eventSourceStatus={eventSourceStatus}
          showSourceKindAlert={showCatalog && !isSourceKindPresent}
        />
        {eventSourceStatus?.loaded || kameletLoaded ? (
          <ConnectedEventSource
            namespace={namespace}
            eventSourceStatus={eventSourceStatus}
            showCatalog={showCatalog}
            selectedApplication={searchParams.get(QUERY_PROPERTIES.APPLICATION)}
            contextSource={searchParams.get(QUERY_PROPERTIES.CONTEXT_SOURCE)}
            sourceKind={searchParams.get('sourceKind')}
            kameletSource={kamelet}
          />
        ) : (
          <LoadingInline />
        )}
      </PageBody>
    </NamespacedPage>
  );
};

export default EventSourcePage;
