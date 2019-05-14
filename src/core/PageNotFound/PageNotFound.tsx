import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

const PageNotFound: React.FunctionComponent = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Sprova | 404</title>
      </Helmet>
      <div>PageNotFound</div>
    </Fragment>
  );
};

export default PageNotFound;
