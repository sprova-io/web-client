import { UserContext } from '@/contexts/UserContext';
import React, { Fragment, useContext } from 'react';
import Helmet from 'react-helmet';

const UserPage: React.FunctionComponent = () => {
  const { user } = useContext(UserContext);
  return (
    <Fragment>
      <Helmet>
        <title>{(user && user.username) || 'User'}</title>
      </Helmet>
      <div>UserPage</div>
    </Fragment>
  );
};

export default UserPage;
