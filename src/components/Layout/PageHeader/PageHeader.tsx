import { Card, Col, Row } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './PageHeader.scss';

interface Props extends RouteComponentProps {
  breadcrumb?: React.ReactNode;
  extra?: React.ReactNode;
  tabs?: React.ReactNode;
  subTitle?: string;
  title: React.ReactNode;
}

const PageHeader: React.FunctionComponent<Props> = ({
  breadcrumb,
  children,
  tabs,
  extra = [],
  subTitle,
  title,
}) => {
  return (
    <div className="sprova-page-header">
      <Row type="flex" justify="space-between" align="top">
        <Col>
          {breadcrumb ? (
            <div style={{ marginBottom: 12 }}>{breadcrumb}</div>
          ) : null}
          <span className="sprova-page-header-title">{title}</span>
          <span className="sprova-page-header-title-sub">{subTitle}</span>
        </Col>
        <Col>{extra}</Col>
      </Row>
      {children && <div className="sprova-page-header-content">{children}</div>}
      {tabs && <div className="sprova-page-header-tabs">{tabs}</div>}
    </div>
  );
};

export default withRouter(PageHeader);
