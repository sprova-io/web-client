import {
  getExecutionContext,
  updateExecutionContextStatus,
} from '@/api/execution-context.api';
import {
  getExecutionsOfContext,
  updateExecutionStatus,
} from '@/api/execution.api';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFetcher } from '@/hooks/useFetcher';
import { parseQuery } from '@/utils';
import {
  Breadcrumb,
  Button,
  Col,
  Icon,
  List,
  notification,
  Popconfirm,
  Progress,
  Row,
  Spin,
} from 'antd';
import _ from 'lodash';
import React, { Fragment, useContext, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Execution,
  ExecutionContextStatus,
  ExecutionStatus,
} from 'sprova-types';
import './ExecutionRun.scss';
import Executor from './Executor';

const ButtonGroup = Button.Group;

interface Params {
  pid: string;
}

const ExecutionRun: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
  location,
  match,
}) => {
  const { contextId } = parseQuery(location);

  const { currentProject } = useContext(ProjectContext);

  const [currentExecution, setCurrentExecution] = useState<Execution | null>(
    null
  );

  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState<boolean>(
    false
  );
  const [isContextUpdateLoading, setIsContextUpdateLoading] = useState<boolean>(
    false
  );

  const { isLoading: isContextLoading } = useFetcher(
    getExecutionContext,
    contextId
  );

  const { data: executions, isLoading: isTestCasesLoading } = useFetcher<
    Execution[]
  >(getExecutionsOfContext, contextId, true);

  if (!currentExecution && executions) {
    const firstPendingExecution: Execution | undefined = _.find(
      executions,
      (execution: Execution) => execution.status === ExecutionStatus.Pending
    );
    setCurrentExecution(firstPendingExecution || executions[0]);
  }

  const handleExecutionSelect = (selectedExecution: Execution) => {
    if (selectedExecution._id !== currentExecution!._id) {
      setCurrentExecution(selectedExecution);
    }
  };

  const abortButton = (
    <Popconfirm
      placement="bottomRight"
      title="Abort this test run?"
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      okText="Yes"
      cancelText="Cancel"
    >
      <a>Abort</a>
    </Popconfirm>
  );

  const handleFinishedExecution = async (executionStatus: ExecutionStatus) => {
    setIsStatusUpdateLoading(true);

    try {
      await updateExecutionStatus(currentExecution!._id!, executionStatus);

      const executionNew: Execution = {
        ...currentExecution!,
        status: executionStatus,
      };

      const index = _.findIndex(executions, {
        _id: executionNew._id,
      });

      executions!.splice(index, 1, executionNew);

      setIsStatusUpdateLoading(false);
    } catch (error) {
      setIsStatusUpdateLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to update Execution Status',
        description: error,
      });
    }
  };

  const finishExecutionContext = async () => {
    setIsContextUpdateLoading(true);

    try {
      await updateExecutionContextStatus(
        contextId as string,
        ExecutionContextStatus.Finished
      );
      setIsContextUpdateLoading(false);
      notification.success({
        placement: 'bottomRight',
        message: 'Execution finished',
      });

      history.push(`/projects/${match.params.pid}/executions/${contextId}`);
    } catch (error) {
      setIsContextUpdateLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to finish Execution',
        description: error,
      });
    }
  };

  const getStatusColor = (status: ExecutionStatus): string => {
    switch (status) {
      case ExecutionStatus.Successful: {
        return '#f6ffed';
      }
      case ExecutionStatus.Warning: {
        return '#fffbe6';
      }
      case ExecutionStatus.Failed: {
        return '#fff1f0';
      }
      default: {
        return 'white';
      }
    }
  };

  const getStatusIcon = (status: ExecutionStatus): string => {
    switch (status) {
      case ExecutionStatus.Successful: {
        return 'check';
      }
      case ExecutionStatus.Warning: {
        return 'exclamation';
      }
      case ExecutionStatus.Failed: {
        return 'close';
      }
      default: {
        return '';
      }
    }
  };

  const hasPendingLeft = () => {
    return !!_.find(
      executions,
      (execution: Execution) => execution.status === ExecutionStatus.Pending
    );
  };

  const findPrevious = () => {
    // return _.findIndex();
  };

  const findNext = () => {};

  const hasPrevious = () => {
    const currentExecutionIndex = _.indexOf(executions, currentExecution);
    return currentExecutionIndex > 0;
  };

  const hasNext = () => {
    const currentExecutionIndex = _.indexOf(executions, currentExecution);
    return currentExecutionIndex < executions!.length - 1;
  };

  const selectPrevious = () => {
    const currentExecutionIndex = _.indexOf(executions, currentExecution);
    handleExecutionSelect(executions![currentExecutionIndex - 1]);
  };

  const selectNext = () => {
    const currentExecutionIndex = _.indexOf(executions, currentExecution);
    handleExecutionSelect(executions![currentExecutionIndex + 1]);
  };

  const getExecutionProgess = () => {
    const finishedExecutions = _.filter(
      executions,
      (execution: Execution) => execution.status !== ExecutionStatus.Pending
    );
    return Math.round((finishedExecutions.length / executions!.length) * 100);
  };

  return isContextLoading || isTestCasesLoading ? (
    <Spin />
  ) : (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${match.params.pid}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Link to={`/projects/${match.params.pid}/executions`}>
              <Breadcrumb.Item>Executions</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Run</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Live Execution"
        subTitle="#51"
        extra={abortButton}
      />
      <PageContent>
        <Progress
          status={getExecutionProgess() < 100 ? 'active' : 'success'}
          className="execution-progress"
          style={{ marginBottom: 24 }}
          percent={getExecutionProgess()}
        />
        <Row gutter={24}>
          <Col span={18}>
            <Level>
              <span style={{ fontSize: 18 }}>
                {currentExecution!.testCaseTitle!}
              </span>
              <ButtonGroup>
                <Button
                  disabled={!hasPrevious()}
                  onClick={selectPrevious}
                  type="primary"
                >
                  <Icon type="left" />
                  Previous
                </Button>
                <Button
                  disabled={!hasNext()}
                  onClick={selectNext}
                  type="primary"
                >
                  Next
                  <Icon type="right" />
                </Button>
              </ButtonGroup>
            </Level>
            <Spin spinning={isStatusUpdateLoading}>
              <Executor
                eid={currentExecution!._id}
                onFinish={handleFinishedExecution}
              />
            </Spin>
          </Col>
          <Col span={6}>
            <List
              className="children-list"
              size="small"
              header={
                <Level>
                  <span>Test Cases</span>
                </Level>
              }
              bordered={true}
              dataSource={executions}
              renderItem={(_execution: Execution) => (
                <List.Item
                  style={{
                    backgroundColor: `${getStatusColor(_execution.status)}`,
                  }}
                  className={`list-item ${
                    _execution._id === currentExecution!._id ? 'selected' : ''
                  }`}
                  onClick={() => handleExecutionSelect(_execution)}
                >
                  <Level>
                    <span>{_execution.testCaseTitle}</span>
                    <Icon type={getStatusIcon(_execution.status)} />
                  </Level>
                </List.Item>
              )}
              footer={<span>Footer</span>}
            />
            <Button
              disabled={hasPendingLeft()}
              onClick={finishExecutionContext}
              style={{ marginBottom: 8 }}
              block={true}
              type="primary"
            >
              Finish
            </Button>
          </Col>
        </Row>
      </PageContent>
    </Fragment>
  );
};

export default withRouter(ExecutionRun);
