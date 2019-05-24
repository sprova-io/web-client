import { getExecutionContexts } from '@/api/execution-context.api';
import Level from '@/components/Level';
import { useFetcher } from '@/hooks/useFetcher';
import { Page } from '@/layouts/ProjectLayout';
import { ExecutionContext, ExecutionContextStatus } from '@/models';
import { Alert, Col, Divider, Icon, List, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './ExecutionOverview.scss';

interface Params {
  pid: string;
}

const ExecutionOverview: React.FunctionComponent<
  RouteComponentProps<Params>
> = ({ history, match }) => {
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

  return (
    <Page>
      {error && (
        <Alert
          message="Something went wrong"
          description={error}
          type="error"
        />
      )}
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
                <Link to={`/projects/${match.params.pid}/executions/schedule`}>
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
            dataSource={filterContextsByStatus(ExecutionContextStatus.Finished)}
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
    </Page>
  );
};

export default withRouter(ExecutionOverview);
