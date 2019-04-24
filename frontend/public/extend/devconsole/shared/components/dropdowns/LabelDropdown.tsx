import * as _ from 'lodash-es';
import * as React from 'react';
import * as fuzzy from 'fuzzysearch';

import { Dropdown, ResourceName, LoadingInline } from '../../../../../components/utils';
import { K8sResourceKind } from '../../../../../module/k8s';

type FirehoseList = {
  data?: K8sResourceKind[];
  [key: string]: any;
};

interface LabelDropdownState {
  items: {};
  selectedKey: string;
  title: React.ReactNode;
}

interface LabelDropdownProps {
  desc?: string;
  placeholder?: string;
  onChange(name, labelKind): void;
  labelSelector: string;
  labelKind: string;
  loaded?: boolean;
  loadError?: string;
  resources?: FirehoseList[];
}

class LabelDropdown extends React.Component<LabelDropdownProps, LabelDropdownState> {
  readonly state = {
    items: {},
    selectedKey: '',
    title: this.props.loaded ? (
      <span className="btn-dropdown__item--placeholder">{this.props.placeholder}</span>
    ) : (
      <LoadingInline />
    ),
  };

  autocompleteFilter(text, item) {
    return fuzzy(text, item.props.name);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  componentWillReceiveProps(nextProps: LabelDropdownProps) {
    const { labelSelector, labelKind, resources, loaded, loadError } = nextProps;
    if (!loaded) {
      return;
    } else {
      this.setState({
        title: <span className="btn-dropdown__item--placeholder">{nextProps.placeholder}</span>,
      });
    }

    if (loadError) {
      this.setState({
        title: <div className="cos-error-title">Error Loading {nextProps.desc}</div>,
      });
    }

    const unsortedList = {};
    _.each(resources, ({ data }) => {
      _.reduce(
        data,
        (acc, resource) => {
          if (resource.metadata.labels.hasOwnProperty(labelSelector)) {
            acc[resource.metadata.labels[labelSelector]] = {
              name: resource.metadata.labels[labelSelector],
              labelKind,
            };
          }
          return acc;
        },
        unsortedList,
      );
    });

    const sortedList = {};
    _.keys(unsortedList)
      .sort()
      .forEach((key) => {
        sortedList[key] = unsortedList[key];
      });
    this.setState({ items: sortedList });
  }

  onChange = (key) => {
    const { name, labelKind } = _.get(this.state, ['items', key], {});
    const title =
      key === 'create' ? (
        <span className="btn-dropdown__item--placeholder">{`Create New ${this.props.labelKind}`}</span>
      ) : (
        <ResourceName kind={labelKind} name={name} />
      );
    this.setState({ selectedKey: key, title });
    // this.props.onChange(name, labelKind);
  };

  render() {
    const items = {};

    _.keys(this.state.items).forEach((key) => {
      const item = this.state.items[key];
      items[key] = <ResourceName kind={item.labelKind} name={item.name} />;
    });

    return (
      <Dropdown
        autocompleteFilter={this.autocompleteFilter}
        canCreate={true}
        createTitle={this.props.labelKind}
        items={items}
        onChange={this.onChange}
        selectedKey={this.state.selectedKey}
        title={this.state.title}
        autocompletePlaceholder={this.props.placeholder}
        dropDownClassName="dropdown--full-width"
        menuClassName="dropdown-menu--text-wrap"
      />
    );
  }
}

export default LabelDropdown;
