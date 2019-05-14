import { logout } from '@/api/auth.api';
import Menu, { Item, NavItem, Section } from '@/components/Menu';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import logo from '@/images/sprova.svg';
import { Cycle } from '@/models/Cycle';
import { findById } from '@/utils';
import { Button, Divider, Icon, Select, Spin } from 'antd';
import React, { Fragment, useContext } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './Sider.scss';

const Option = Select.Option;

const Sider: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const { currentCycle, cycles, isCyclesFetched, onSelectCycle } = useContext(
    CycleContext
  );
  const { currentProject, isProjectsFetched } = useContext(ProjectContext);
  const { onLogout, user } = useContext(UserContext);

  const changeProject = () => {
    history.push('/projects');
  };

  const signout = () => {
    logout();
    onLogout();
    history.push('/login');
  };

  const handleCycleChange = (cycleId: string) => {
    const cycle = findById(cycles, cycleId);

    if (cycle) {
      onSelectCycle(cycle);
      history.push(`/projects/${currentProject!._id}`);
    }
  };

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
              <Section title="Cycle">
                <Item>
                  <Select
                    defaultValue={currentCycle._id}
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: '4px 0' }} />
                        <div
                          style={{ padding: '8px', cursor: 'pointer' }}
                          onClick={() =>
                            history.push(
                              `/projects/${currentProject!._id}/cycles/new`
                            )
                          }
                        >
                          <Icon type="plus" /> Add item
                        </div>
                      </div>
                    )}
                    onChange={handleCycleChange}
                    style={{ width: '160' }}
                  >
                    {cycles.map((cycle: Cycle) => (
                      <Option key={cycle._id} value={cycle._id}>
                        {cycle.title}
                      </Option>
                    ))}
                  </Select>
                </Item>
              </Section>
            ) : null}
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
                <Section title="More">
                  <NavItem
                    icon={<Icon type="setting" />}
                    route={`/projects/${currentProject._id}/settings`}
                  >
                    Project Settings
                  </NavItem>
                </Section>
              </Fragment>
            ) : null}
            <Section title="General">
              <Item icon={<Icon type="swap" />} onClick={changeProject}>
                Change Project
              </Item>
              <NavItem
                icon={<Icon type="user" />}
                route={`/users/${user!._id}`}
              >
                {user!.username}
              </NavItem>
              <Item icon={<Icon type="logout" />} onClick={signout}>
                Sign Out
              </Item>
            </Section>
          </Menu>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Sider);
