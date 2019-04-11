/* eslint-disable no-unused-vars, no-undef */
import * as React from 'react';
import { connect } from 'react-redux';
import { Nav, NavList, PageSidebar } from '@patternfly/react-core';
import { HrefLink, NavSection, ResourceClusterLink, ResourceNSLink } from '../../../components/nav';
import { FLAGS } from '../../../features';
import { BuildModel } from '../../../models';

interface DevConsoleNavigationProps {
  isNavOpen: boolean;
  location: string;
  onNavSelect: () => void;
  onToggle: () => void;
}

const DevNavSection = NavSection as React.ComponentClass<any>;

export const PageNav = (props: DevConsoleNavigationProps) => {
  const isActive = (path: string) => {
    return props.location.endsWith(path);
  };

  return (
    <Nav aria-label="Nav" onSelect={props.onNavSelect} onToggle={props.onToggle}>
      <NavList>
        <HrefLink
          href="/add"
          name="+Add"
          activePath="/dev/add"
          isActive={isActive('/add')}
        />
        <HrefLink
          href="/topology"
          name="Topology"
          activePath="/dev/topology"
          isActive={isActive('/topology')}
        />
        <ResourceNSLink resource="buildconfigs" name={BuildModel.labelPlural} isActive={isActive('/buildconfigs')} />
        <HrefLink href="/pipelines" name="Pipelines" activePath="/pipelines" isActive={isActive('/pipelines')} />
        <DevNavSection title="Advanced">
          <ResourceClusterLink resource="projects" name="Projects" required={FLAGS.OPENSHIFT} />
          <HrefLink href="/overview" name="Status" activePath="/overview" required={FLAGS.OPENSHIFT} />
          <HrefLink href="/status" name="Status" activePath="/status" disallowed={FLAGS.OPENSHIFT} />
          <ResourceNSLink resource="events" name="Events" />
          <HrefLink href="/search" name="Search" activePath="/search" />
        </DevNavSection>
      </NavList>
    </Nav>
  );
};

export const DevConsoleNavigation: React.FunctionComponent<DevConsoleNavigationProps> = (
  props: DevConsoleNavigationProps,
) => {
  return <PageSidebar nav={<PageNav {...props} />} isNavOpen={props.isNavOpen} />;
};

const mapStateToProps = (state) => {
  return {
    location: state.UI.get('location'),
  };
};

export default connect(mapStateToProps)(DevConsoleNavigation);
