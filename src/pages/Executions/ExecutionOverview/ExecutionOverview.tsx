import { getExecutionContexts } from '@/api/execution-context.api';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFetcher } from '@/hooks/useFetcher';
import {
  ExecutionContext,
  ExecutionContextStatus,
} from '@/models/ExecutionContext';
import { Alert, Breadcrumb, Button, Col, Divider, Icon, List, Row } from 'antd';
import _ from 'lodash';
import React, { Fragment, useContext } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './ExecutionOverview.scss';

interface Params {
  pid: string;
}

const ExecutionOverview: React.FunctionComponent<
  RouteComponentProps<Params>
> = ({ history, match }) => {
  const { currentProject } = useContext(ProjectContext);

  const {
    data: executionContexts,
    isLoading: isExecutionContextsLoading,
    error,
  } = useFetcher<ExecutionContext[]>(getExecutionContexts, match.params.pid);

  const filterContextsByStatus = (status: ExecutionContextStatus) => {
    return _.filter(
      executionContexts,
      (executionContext: ExecutionContext) => executionContext.status === status
    );
  };

  return error ? (
    <Alert message="Something went wrong" description={error} type="error" />
  ) : (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${match.params.pid}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Executions</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Overview"
        extra={
          <Link key="0" to={`/projects/${match.params.pid}/executions/setup`}>
            <Button type="primary">
              <Icon type="caret-right" /> Start new
            </Button>
          </Link>
        }
      />
      <PageContent>
        <List
          loading={isExecutionContextsLoading}
          className="children-list is-highlight"
          size="small"
          header={
            <div>
              <Icon type="loading" style={{ marginRight: 8 }} />
              Active Executions
            </div>
          }
          bordered={true}
          dataSource={filterContextsByStatus(ExecutionContextStatus.Active)}
          renderItem={(executionContext: ExecutionContext) => (
            <List.Item
              onClick={() =>
                history.push(
                  `/projects/${match.params.pid}/executions/run?contextId=${
                    executionContext._id
                  }`
                )
              }
            >
              <Level>
                <div>
                  <div style={{ fontSize: 10, color: 'grey' }}>
                    {executionContext.method}
                    <Divider type="vertical" />
                    {executionContext.type}
                  </div>
                  <span>{executionContext._id}</span>
                </div>
                <div style={{ textAlign: 'end' }}>
                  <div style={{ fontSize: 10, color: 'grey' }}>
                    {new Date(executionContext.createdAt).toLocaleString()}
                  </div>
                  <span>5/10</span>
                </div>
              </Level>
            </List.Item>
          )}
        />
        <Row gutter={16}>
          <Col span={12} style={{ marginBottom: 24 }}>
            <List
              loading={isExecutionContextsLoading}
              className="children-list"
              size="small"
              header={
                <Level>
                  <span>
                    <Icon type="clock-circle" style={{ marginRight: 8 }} />
                    Scheduled Executions
                  </span>
                  <Link
                    to={`/projects/${match.params.pid}/executions/schedule`}
                  >
                    Show Schedule
                  </Link>
                </Level>
              }
              bordered={true}
              dataSource={filterContextsByStatus(
                ExecutionContextStatus.Scheduled
              )}
              renderItem={(executionContext: ExecutionContext) => (
                <List.Item>{executionContext._id}</List.Item>
              )}
            />
          </Col>
          <Col span={12} style={{ marginBottom: 24 }}>
            <List
              loading={isExecutionContextsLoading}
              className="children-list"
              size="small"
              header={
                <Level>
                  <span>
                    <Icon type="check-circle" style={{ marginRight: 8 }} />
                    Finished Executions
                  </span>
                  <Link to={`/projects/${match.params.pid}/executions/history`}>
                    Show History
                  </Link>
                </Level>
              }
              bordered={true}
              dataSource={filterContextsByStatus(
                ExecutionContextStatus.Finished
              )}
              renderItem={(executionContext: ExecutionContext) => (
                <List.Item
                  onClick={() =>
                    history.push(
                      `/projects/${match.params.pid}/executions/${
                        executionContext._id
                      }`
                    )
                  }
                >
                  {executionContext._id}
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </PageContent>
    </Fragment>
  );
};

export default withRouter(ExecutionOverview);
