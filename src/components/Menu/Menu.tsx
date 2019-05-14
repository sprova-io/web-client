import cx from 'classnames';
import React from 'react';
import { matchPath, RouteComponentProps, withRouter } from 'react-router';
import './Menu.scss';

interface ItemProps {
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Item: React.FunctionComponent<ItemProps> = ({
  active,
  children,
  icon,
  onClick,
}) => {
  return (
    <li
      className={cx(
        'sprova-menu-item',
        { 'is-active': active },
        { clickable: onClick }
      )}
      onClick={onClick}
    >
      {icon && <span className="sprova-menu-navitem-icon">{icon}</span>}
      {children}
    </li>
  );
};

interface NavItemProps extends RouteComponentProps {
  exact?: boolean;
  icon?: React.ReactNode;
  route: string;
}

export const NavItem = withRouter<NavItemProps>(
  ({ children, exact = false, history, icon, location, route }) => {
    const match =
      route &&
      matchPath(location.pathname, {
        exact,
        path: route,
      });

    const navigate = () => {
      if (route) {
        history.push(route);
      }
    };

    return (
      <li
        className={cx('sprova-menu-navitem', { 'is-active': !!match })}
        onClick={navigate}
      >
        {icon && <span className="sprova-menu-navitem-icon">{icon}</span>}
        {children}
      </li>
    );
  }
);

interface SectionProps {
  title?: string;
}

export const Section: React.FunctionComponent<SectionProps> = ({
  children,
  title,
}) => {
  return (
    <div className="sprova-menu-section">
      {title && <div className="sprova-menu-section-title">{title}</div>}
      <ul className="sprova-menu-section-list">{children}</ul>
    </div>
  );
};

const Menu: React.FunctionComponent = ({ children }) => {
  return <div className="sprova-menu">{children}</div>;
};

export default Menu;
