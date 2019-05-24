import Header from '@/layouts/ProjectLayout/Header';
import { LayoutProvider } from '@/layouts/ProjectLayout/LayoutContext';
import Sider from '@/layouts/ProjectLayout/Sider';
import React from 'react';
import './ProjectLayout.scss';

const ProjectLayout: React.FunctionComponent = ({ children }) => {
  return (
    <LayoutProvider>
      <div className="sprova-project-layout">
        <Sider />
        <Header />
        {children}
      </div>
    </LayoutProvider>
  );
};

export default ProjectLayout;
