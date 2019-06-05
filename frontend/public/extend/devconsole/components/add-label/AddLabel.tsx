import * as React from 'react';
import { EnvironmentPage } from './../../../../../public/components/environment';

interface LabelValue {
  name: string;
  value: string;
}

interface DeploymentConfigProps {
  onLabelAdd: (obj: LabelValue) => void;
}

const AddLabel: React.FC<DeploymentConfigProps> = ({onLabelAdd}) => {

  return (
    <React.Fragment>
      <div className="co-section-heading">Labels</div>
      <div>Each label is applied to each created resource.</div>
      <EnvironmentPage
        envPath={['','']}
        readOnly={false}
        onChange={onLabelAdd}
        addConfigMapSecret={false}
        useLoadingInline={true} />
    </React.Fragment>
  );
}

export default AddLabel;