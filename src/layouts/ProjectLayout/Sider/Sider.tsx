import Menu, { NavItem, Section } from '@/components/Menu';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import logo from '@/images/sprova.svg';
import { Icon, Spin } from 'antd';
import React, { Fragment, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './Sider.scss';

const Sider: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const { currentCycle, isCyclesFetched } = useContext(CycleContext);
  const { currentProject, isProjectsFetched } = useContext(ProjectContext);

  return (
    <div className="sprova-sider">
      <div
        className="sprova-sider-title"
        onClick={() =>
          currentProject && history.push(`/projects/${currentProject._id}`)
        }
      >
        <img id="sprova-logo" src={logo} alt="logo" />
        <h3 id="sprova-project-title">
          {(currentProject && currentProject.title) || 'Sprova'}
        </h3>
      </div>

      <div className="sprova-sider-menu">
        {!(isProjectsFetched && isCyclesFetched) ? (
          <Spin />
        ) : currentProject ? (
          <Menu>
            {currentCycle ? (
              <Fragment>
                <Section title="Menu">
                  <NavItem
                    icon={<Icon type="home" />}
                    exact={true}
                    route={`/projects/${currentProject._id}`}
                  >
                    Home
                  </NavItem>
                  <NavItem
                    icon={<Icon type="thunderbolt" />}
                    route={`/projects/${currentProject._id}/executions`}
                  >
                    Executions
                  </NavItem>
                  <NavItem
                    icon={<Icon type="file-text" />}
                    route={`/projects/${currentProject._id}/testcases`}
                  >
                    Test Cases
                  </NavItem>
                </Section>
              </Fragment>
            ) : null}
            <Section title="More">
              <NavItem
                icon={<Icon type="setting" />}
                route={`/projects/${currentProject._id}/settings`}
              >
                Project Settings
              </NavItem>
            </Section>
          </Menu>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Sider);
