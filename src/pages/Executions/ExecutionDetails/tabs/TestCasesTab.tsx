import { getExecutionSteps } from '@/api/execution.api';
import Level from '@/components/Level';
import { Alert, Col, Icon, List, Row, Spin, Tag } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Execution,
  ExecutionStatus,
  ExecutionStep,
  ExecutionStepResult,
} from 'sprova-types';

interface Props {
  executions: Execution[];
}

const TestCasesTab: React.FunctionComponent<Props> = ({ executions }) => {
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isExecutionStepsLoading, setIsExecutionStepsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [currentStep, setCurrentStep] = useState<ExecutionStep>();

  const [currentExecution, setCurrentExecution] = useState<Execution>(
    executions[0]
  );

  const handleExecutionSelect = (selectedExecution: Execution) => {
    if (selectedExecution._id !== currentExecution!._id) {
      setCurrentExecution(selectedExecution);
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

  const getTagColor = (result: ExecutionStepResult): string => {
    switch (result) {
      case ExecutionStepResult.Successful: {
        return 'green';
      }
      case ExecutionStepResult.Failed: {
        return 'red';
      }
      case ExecutionStepResult.Pending: {
        return 'blue';
      }
      case ExecutionStepResult.Warning: {
        return 'orange';
      }
      default: {
        return '';
      }
    }
  };

  const handleStepSelect = (executionStep: ExecutionStep) => {
    setCurrentStep(executionStep);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsExecutionStepsLoading(true);
      setError('');

      try {
        const fetchedData = await getExecutionSteps(currentExecution._id);
        setExecutionSteps(fetchedData);
        setCurrentStep(fetchedData[0]);
      } catch (error) {
        setError(error);
      }

      setIsExecutionStepsLoading(false);
    };

    fetchData();
  }, [currentExecution]);

  return (
    <Row gutter={24}>
      <Col span={8}>
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
        />
      </Col>
      <Col span={16}>
        {isExecutionStepsLoading ? (
          <Spin />
        ) : error ? (
          <Alert
            message="Something went wrong"
            description={error}
            type="error"
          />
        ) : (
          <List
            className="executor-list"
            size="default"
            bordered={true}
            dataSource={executionSteps}
            renderItem={(executionStep: ExecutionStep) =>
              currentStep && executionStep.key === currentStep.key ? (
                <List.Item
                  style={{
                    display: 'block',
                    paddingBottom: 24,
                    backgroundColor: 'rgba(0, 0, 0, 0.025)',
                    overflow: 'hidden',
                  }}
                >
                  <Level>
                    <div>
                      <h4>{executionStep.action}</h4>
                      <div>{`Expected: ${executionStep.expected}`}</div>
                    </div>
                    <Fragment>
                      {executionStep.inheritedFrom ? (
                        <Tag style={{ pointerEvents: 'none' }}>Inherited</Tag>
                      ) : null}
                      <Tag
                        color={getTagColor(executionStep.result)}
                        style={{ pointerEvents: 'none' }}
                      >
                        {executionStep.result}
                      </Tag>
                    </Fragment>
                  </Level>
                  <div>
                    <strong>Message: </strong>
                    {executionStep.message || <i>No message.</i>}
                  </div>
                </List.Item>
              ) : (
                <List.Item
                  className="selectable-step"
                  onClick={() => handleStepSelect(executionStep)}
                >
                  <List.Item.Meta
                    title={executionStep.action}
                    description={`Expected: ${executionStep.expected}`}
                  />
                  {executionStep.inheritedFrom ? (
                    <Tag style={{ pointerEvents: 'none' }}>Inherited</Tag>
                  ) : null}
                  <Tag
                    color={getTagColor(executionStep.result)}
                    style={{ pointerEvents: 'none' }}
                  >
                    {executionStep.result}
                  </Tag>
                </List.Item>
              )
            }
          />
        )}
      </Col>
    </Row>
  );
};

export default TestCasesTab;
