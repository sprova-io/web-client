import { logout } from '@/api/auth.api';
import Level from '@/components/Level';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import { LayoutContext } from '@/layouts/ProjectLayout/LayoutContext';
import { Cycle } from '@/models';
import { findById } from '@/utils';
import { Button, Dropdown, Icon, Menu, Select } from 'antd';
import React, { Fragment, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import './Header.scss';

const Option = Select.Option;

const Header: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  const { currentCycle, cycles, onSelectCycle } = useContext(CycleContext);
  const { currentProject } = useContext(ProjectContext);
  const { user, onLogout } = useContext(UserContext);
  const { subTitle, title } = useContext(LayoutContext);

  const signout = () => {
    logout();
    onLogout();
    history.push('/login');
  };

  const optionsMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/projects">Change Project</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={signout}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const handleCycleChange = (cycleId: string) => {
    const cycle = findById(cycles, cycleId);

    if (cycle) {
      onSelectCycle(cycle);
      history.push(`/projects/${currentProject!._id}`);
    }
  };

  return (
    <div className="sprova-project-header">
      <Level style={{ height: '100%' }}>
        <div className="sprova-project-header-left">
          {currentCycle ? (
            <Fragment>
              <Link to={`/projects/${currentProject!._id}/cycles/new`}>
                <Button style={{ marginLeft: 24 }}>
                  <Icon type="plus" />
                </Button>
              </Link>
              <Select
                value={currentCycle._id}
                defaultValue={currentCycle._id}
                onChange={handleCycleChange}
                style={{ marginLeft: 8, width: '160' }}
              >
                {cycles.map((cycle: Cycle) => (
                  <Option key={cycle._id} value={cycle._id}>
                    {cycle.title}
                  </Option>
                ))}
              </Select>
            </Fragment>
          ) : null}
          <span className="sprova-project-header-title">
            {title || (currentProject && currentProject!.title) || 'Sprova App'}
          </span>
          {subTitle && (
            <span className="sprova-project-header-title-sub">{subTitle}</span>
          )}
        </div>
        <div className="sprova-project-header-right">
          <div className="sprova-project-header-item">
            <Link to={`/users/${user!._id}`}>{user!.username}</Link>
          </div>
          <div className="sprova-project-header-item">
            <Dropdown overlay={optionsMenu} placement="bottomRight">
              <a className="ant-dropdown-link" href="#">
                Options <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        </div>
      </Level>
    </div>
  );
};

export default withRouter(Header);
