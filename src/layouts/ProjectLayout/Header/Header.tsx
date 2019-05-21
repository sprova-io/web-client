import { logout } from '@/api/auth.api';
import Level from '@/components/Level';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import { findById } from '@/utils';
import { Button, Dropdown, Icon, Menu, Select } from 'antd';
import React, { Fragment, useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Cycle } from 'sprova-types';
import './Header.scss';

const Option = Select.Option;

interface Props extends RouteComponentProps {
  subTitle?: string;
  title: React.ReactNode;
}

const Header: React.FunctionComponent<Props> = ({
  history,
  subTitle,
  title,
}) => {
  const { currentCycle, cycles, onSelectCycle } = useContext(CycleContext);
  const { currentProject } = useContext(ProjectContext);
  const { user, onLogout } = useContext(UserContext);

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
    <div className="sprova-header">
      <Level style={{ height: '100%' }}>
        <div className="sprova-header-left">
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
              <span className="sprova-header-title">{title}</span>
              {subTitle && (
                <span className="sprova-header-title-sub">{subTitle}</span>
              )}
            </Fragment>
          ) : null}
        </div>
        <div className="sprova-header-right">
          <div className="sprova-header-item">
            <Link to={`/users/${user!._id}`}>{user!.username}</Link>
          </div>
          <div className="sprova-header-item">
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
