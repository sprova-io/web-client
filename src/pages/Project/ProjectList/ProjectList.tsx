import { logout } from '@/api/auth.api';
import Card, { CardBody } from '@/components/Card';
import { PageLoad } from '@/components/Layout';
import Level from '@/components/Level';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import { Alert, Button, Divider, Empty, Icon } from 'antd';
import React, { Fragment, useContext } from 'react';
import Helmet from 'react-helmet';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Project } from 'sprova-types';
import './ProjectList.scss';

const ProjectList: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const {
    currentProject,
    projects,
    error,
    isProjectsFetched,
    onSelectProject,
  } = useContext(ProjectContext);
  const { onLogout, user } = useContext(UserContext);

  const selectProject = (project: Project) => {
    onSelectProject(project);
    history.push(`/projects/${project._id}`);
  };

  const isCurrentProject = (project: Project) =>
    currentProject && currentProject._id === project._id;

  const signout = () => {
    logout();
    onLogout();
    history.push('/login');
  };

  return (
    <Fragment>
      <Helmet>
        <title>Sprova | Projects</title>
      </Helmet>
      {isProjectsFetched ? (
        <div className="projects-list-page">
          <div className="projects-list-container">
            <Level align="bottom">
              <h3>Projects</h3>
              <Link to="/projects/new">
                <Button type="primary">New</Button>
              </Link>
            </Level>
            <Divider />

            <div className="project-list">
              {error ? (
                <Alert message={error} type="error" />
              ) : projects && projects.length > 0 ? (
                projects.map((project: Project, index: number) => (
                  <Card
                    key={index}
                    onClick={() => selectProject(project)}
                    style={{ marginBottom: 24 }}
                    status={isCurrentProject(project) ? 'info' : null}
                  >
                    <CardBody>
                      <h3>{project.title}</h3>
                      <p>{'No description.'}</p>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Empty description={'No Projects found'}>
                  <Link to="/projects/new">
                    <Button type="primary">Create New Project</Button>
                  </Link>
                </Empty>
              )}
            </div>

            <div className="project-list-footer">
              <Link to={`/users/${user!._id}`}>
                <Icon style={{ marginRight: 8 }} type="user" />
                {user!.username}
              </Link>
              <Divider type="vertical" />
              <Link to="/settings">
                <Icon style={{ marginRight: 8 }} type="setting" />
                Settings
              </Link>
              <Divider type="vertical" />
              <a onClick={signout}>
                <Icon style={{ marginRight: 8 }} type="logout" />
                Sign Out
              </a>
            </div>
          </div>
        </div>
      ) : (
        <PageLoad />
      )}
    </Fragment>
  );
};

export default withRouter(ProjectList);
