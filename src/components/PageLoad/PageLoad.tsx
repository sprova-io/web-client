import { Spin } from 'antd';
import React from 'react';
import './PageLoad.scss';

const PageLoad: React.FunctionComponent = () => {
  return (
    <div className="sprova-page-load">
      <Spin />
    </div>
  );
};

export default PageLoad;
