import Header from '@/layouts/ProjectLayout/Header';
import Sider from '@/layouts/ProjectLayout/Sider';
import React from 'react';
import './ProjectLayout.scss';

const ProjectLayout: React.FunctionComponent = ({ children }) => {
  return (
    <div className="sprova-project-layout">
      <Sider />
      <Header title="Header" />
      {children}
    </div>
  );
};

export default ProjectLayout;
