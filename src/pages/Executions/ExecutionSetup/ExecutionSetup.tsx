import { postExecutionContext } from '@/api/execution-context.api';
import { postExecutions } from '@/api/execution.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import TestCaseSelect from '@/components/TestCaseSelect/TestCaseSelect';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { UserContext } from '@/contexts/UserContext';
import { Breadcrumb, Button, Checkbox, notification, Select } from 'antd';
import * as _ from 'lodash';
import React, { Fragment, useContext, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Execution,
  ExecutionContext,
  ExecutionContextStatus,
  ExecutionMethod,
  ExecutionStatus,
  ExecutionType,
  TestCase,
} from 'sprova-types';
import './ExecutionSetup.scss';

const Option = Select.Option;

interface Params {
  pid: string;
}

const ExecutionSetup: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
}) => {
  const { currentProject } = useContext(ProjectContext);
  const { testCases } = useContext(TestCaseContext);
  const { user } = useContext(UserContext);

  const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
  const [target, setTarget] = useState<string>('testcases');
  const [isExecutionLoading, setIsExecutionLoading] = useState<boolean>(false);
  const [isExecuteWholeCycle, setIsExecuteWholeCycle] = useState<boolean>(
    false
  );

  const handleSelectTestCase = (testCase: TestCase) => {
    setSelectedTestCases([...selectedTestCases, testCase]);
  };

  const handleRemoveTestCase = (testCase: TestCase) => {
    setSelectedTestCases(_.without(selectedTestCases, testCase));
  };

  const isValidSelection = () =>
    isExecuteWholeCycle ||
    (target === 'testcases' && selectedTestCases.length > 0);

  const handleStartExecution = async () => {
    const executionContextNew: Partial<ExecutionContext> = {
      userId: user!._id,
      projectId: currentProject!._id,
      type: ExecutionType.TestCases,
      method: ExecutionMethod.Manual,
      status: ExecutionContextStatus.Active,
    };

    setIsExecutionLoading(true);

    try {
      const { _id: contextId } = await postExecutionContext(
        executionContextNew
      );

      const executions: Array<Partial<Execution>> = (isExecuteWholeCycle
        ? testCases
        : selectedTestCases
      ).map((testCase: TestCase) => {
        return {
          contextId,
          testCaseId: testCase._id,
          status: ExecutionStatus.Pending,
        };
      });

      await postExecutions(executions);
      notification.success({
        placement: 'bottomRight',
        message: 'Execution started',
        description: `Execution Context created with ID ${contextId}`,
      });
      history.push(
        `/projects/${currentProject!._id}/executions/run?contextId=${contextId}`
      );
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to start Execution Context',
        description: error,
      });
    } finally {
      setIsExecutionLoading(false);
    }
  };

  return (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${currentProject!._id}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Link to={`/projects/${currentProject!._id}/executions`}>
              <Breadcrumb.Item>Executions</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Setup</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Start New Execution"
      />
      <PageContent>
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <h4>Execution Target</h4>
          </CardHeader>
          <CardBody darker={true}>
            <Level>
              <div>
                <span style={{ marginRight: 16 }}>Target</span>
                <Select
                  defaultValue="testcases"
                  disabled={isExecuteWholeCycle}
                  placeholder="None"
                  style={{ width: 200 }}
                >
                  <Option value="testcases">Test Cases</Option>
                </Select>
              </div>
              <Checkbox
                onChange={() => setIsExecuteWholeCycle(!isExecuteWholeCycle)}
              >
                Execute Whole Cycle
              </Checkbox>
            </Level>
          </CardBody>
        </Card>

        {!isExecuteWholeCycle && target === 'testcases' ? (
          <TestCaseSelect
            onRemoveTestCase={handleRemoveTestCase}
            onSelectTestCase={handleSelectTestCase}
            selectedTestCases={selectedTestCases}
            style={{ marginBottom: 24 }}
          />
        ) : null}

        <Button
          disabled={!isValidSelection()}
          loading={isExecutionLoading}
          onClick={handleStartExecution}
          type="primary"
        >
          Execute
        </Button>
      </PageContent>
    </Fragment>
  );
};

export default withRouter(ExecutionSetup);
