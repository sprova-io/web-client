import React from 'react';
import './Page.scss';

const Page: React.FunctionComponent = ({ children }) => {
  return <div className="sprova-page">{children}</div>;
};

export default Page;
