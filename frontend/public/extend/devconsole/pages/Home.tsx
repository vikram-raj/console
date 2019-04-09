import * as React from 'react';
import { Button } from '@patternfly/react-core';

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="co-well">
      <h4>Developer console Getting Started</h4>
      <p>
        Developer console is an internal feature and enabled only in development. See our documention
        for instructions on how to enable the devconsole.
      </p>
      <p>Developer console is an alpha feature.</p>
      <Button component="a" href="/dev/import" variant="primary">
        Import from Git
      </Button>
    </div>
  );
};

export default HomePage;
