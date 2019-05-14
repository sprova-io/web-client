import { ProjectContext } from '@/contexts/ProjectContext';
import { Button, Empty } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const CyclesNotFound = () => {
  const { currentProject } = useContext(ProjectContext);
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <Empty description={'No Cycles found'}>
        <Link to={`/projects/${currentProject!._id}/cycles/new`}>
          <Button type="primary">Create New Cycle</Button>
        </Link>
      </Empty>
    </div>
  );
};

export default CyclesNotFound;
