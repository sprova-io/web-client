import classnames from 'classnames';
import React from 'react';
import './Card.scss';

interface CardProps {
  onClick?: () => void;
  status?: 'success' | 'error' | 'warning' | 'info' | null;
  style?: any;
}

const Card: React.FunctionComponent<CardProps> = ({
  children,
  onClick,
  status,
  style,
}) => {
  return (
    <div
      className={classnames(
        'sprova-card',
        { 'is-clickable': onClick },
        { [`is-${status}`]: status }
      )}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
      {status && <div className="sprova-card-status-bar" />}
    </div>
  );
};

export default Card;

interface CardBodyProps {
  darker?: boolean;
  padded?: boolean;
}

export const CardBody: React.FunctionComponent<CardBodyProps> = ({
  children,
  darker = false,
  padded = true,
}) => {
  return (
    <div
      className={classnames(
        'sprova-card-body',
        { 'is-padded': padded },
        { 'is-darker': darker }
      )}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  darker?: boolean;
  padded?: boolean;
}

export const CardFooter: React.FunctionComponent<CardFooterProps> = ({
  children,
  darker = false,
  padded = true,
}) => {
  return (
    <div
      className={classnames(
        'sprova-card-footer',
        { 'is-padded': padded },
        { 'is-darker': darker }
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FunctionComponent = ({ children }) => {
  return <div className="sprova-card-header">{children}</div>;
};
