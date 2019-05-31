import * as React from 'react';
import { shallow } from 'enzyme';
import BuildConfig from './../BuildConfig';

describe('BuildConfig: ', () => {
  const props = {
    onConfigureWebhookChange: () => {},
    onAutomaticallyBuildChange: () => {},
    onLaunchFirstBuildChange: () => {},
    onEnviromentVariableChange: () => {},
  };

  it('renders', () => {
    const buildConfig = shallow(<BuildConfig {...props} />);
    expect(buildConfig).toBeTruthy();
  });
});
