import React from 'react';
import './Layout.scss';
import Page from './Page';
import Sider from './Sider';

const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <div className="sprova-layout">
      <Sider />
      <Page>{children}</Page>
    </div>
  );
};

export default Layout;
