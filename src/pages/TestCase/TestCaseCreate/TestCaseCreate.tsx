import { getTestCaseSteps, postTestCase } from '@/api/testcase.api';
import Card, { CardBody, CardFooter, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import Table, { TableColumn, TableRow } from '@/components/Table';
import TextArea from '@/components/TextArea';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { TestCase } from '@/models/TestCase';
import { TestStep } from '@/models/TestStep';
import {
  Breadcrumb,
  Button,
  Icon,
  notification,
  Select,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import * as _ from 'lodash';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './TestCaseCreate.scss';
import TestStepInput from './TestStepInput';

const Option = Select.Option;

interface Params {
  pid: string;
}

const TestCaseCreate: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
  match,
}) => {
  const { currentProject } = useContext(ProjectContext);
  const { currentCycle } = useContext(CycleContext);
  const { testCases, onAddTestCase } = useContext(TestCaseContext);

  const {
    value: testCaseTitle,
    handleChange: handleTestCaseTitleChange,
  } = useFormInput('');
  const {
    value: description,
    handleChange: handleDescriptionChange,
  } = useFormTextArea('');

  const [parent, setParent] = useState<TestCase | null>(null);
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  const [inheritedSteps, setInheritedSteps] = useState<TestStep[]>([]);
  const [showInherited, setShowInherited] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestStepsLoading, setIsTestStepsLoading] = useState<boolean>(false);
  const [testStepsError, setTestStepsError] = useState<string | null>(null);

  const handleParentSelect = (parentId: string) => {
    const parentNew = testCases.find((testCase) => testCase._id === parentId);
    setParent(parentNew || null);

    if (!parentNew) {
      setShowInherited(false);
    }
  };

  const handleAddTestStep = (testStep: TestStep) => {
    setTestSteps([...testSteps, testStep]);
  };

  const handleCreateTestCase = async () => {
    const testCaseNew: Partial<TestCase> = {
      title: testCaseTitle,
      description,
      projectId: currentProject!._id,
      cycleId: currentCycle!._id,
      steps: testSteps,
    };

    if (parent) {
      testCaseNew.parentId = parent._id;
    }

    setIsLoading(true);

    try {
      const testCase = await postTestCase(testCaseNew);
      setIsLoading(false);
      onAddTestCase(testCase);
      notification.success({
        placement: 'bottomRight',
        message: `${testCase.title} created`,
        description: `Test case created with ID ${testCase._id}`,
      });
      history.push(`/projects/${match.params.pid}/testcases`);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to create test case',
        description: error,
      });
    }
  };

  const handleShowInheritedSwitch = () => {
    setShowInherited(!showInherited);
  };

  const handleRemoveTestStep = (testStep: TestStep) => {
    setTestSteps(_.without(testSteps, testStep));
  };

  const isFormValid = () =>
    testCaseTitle && testCaseTitle.length > 0 && testSteps.length > 0;

  useEffect(() => {
    if (!parent) {
      setInheritedSteps([]);
      return;
    }

    const fetchInheritedSteps = async () => {
      setIsTestStepsLoading(true);

      try {
        let fetchedTestSteps = await getTestCaseSteps(parent._id, true);

        fetchedTestSteps = fetchedTestSteps.map((step: TestStep) =>
          step.inheritedFrom ? step : { ...step, inheritedFrom: parent.title }
        );

        setInheritedSteps(fetchedTestSteps);
        setTestStepsError(null);
      } catch (error) {
        setTestStepsError(error);
        setShowInherited(false);
      } finally {
        setIsTestStepsLoading(false);
      }
    };

    fetchInheritedSteps();
  }, [parent]);

  return (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${match.params.pid}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Link to={`/projects/${match.params.pid}/testcases`}>
              <Breadcrumb.Item>Test Cases</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>New</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Create Test Case"
      />
      <PageContent>
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <h4>General Information</h4>
          </CardHeader>
          <CardBody darker={true}>
            <Input
              label="Title"
              onChange={handleTestCaseTitleChange}
              placeholder="Test Case"
              required={true}
              style={{ marginBottom: 24 }}
              value={testCaseTitle}
            />
            <TextArea
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Description"
            />
          </CardBody>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <h4 style={{ marginBottom: 16 }}>* Test Steps</h4>
            <Level>
              <div>
                <span style={{ marginRight: 16 }}>Inherit from</span>
                <Select
                  allowClear={true}
                  showSearch={true}
                  placeholder="None"
                  optionFilterProp="children"
                  value={(parent && parent._id) || undefined}
                  onChange={handleParentSelect}
                  style={{ width: 200 }}
                >
                  {testCases.map((testCase, index) => (
                    <Option key={index} value={testCase._id}>
                      {testCase.title}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                {testStepsError && (
                  <Tooltip title={testStepsError}>
                    <Icon
                      style={{ marginRight: 8 }}
                      type="close-circle"
                      theme="twoTone"
                      twoToneColor="red"
                    />
                  </Tooltip>
                )}
                <span style={{ marginRight: 8 }}>Show inherited steps</span>
                <Switch
                  checked={showInherited}
                  disabled={!parent || !!testStepsError}
                  loading={isTestStepsLoading}
                  onChange={handleShowInheritedSwitch}
                />
              </div>
            </Level>
          </CardHeader>
          <CardBody padded={false}>
            <Table
              columnTitles={['#', 'Action', 'Expected', 'Inherited From', '']}
              data={[...(showInherited ? inheritedSteps : []), ...testSteps]}
              empty="No Test Steps."
              renderRow={(testStep: TestStep, index: number) => (
                <TableRow key={index}>
                  <TableColumn>{index + 1}</TableColumn>
                  <TableColumn>{testStep.action}</TableColumn>
                  <TableColumn>
                    {testStep.expected || (
                      <span style={{ opacity: 0.4 }}>No expected result</span>
                    )}
                  </TableColumn>
                  <TableColumn>
                    {testStep.inheritedFrom ? (
                      <Tag>{testStep.inheritedFrom}</Tag>
                    ) : (
                      <span style={{ opacity: 0.4 }}>None</span>
                    )}
                  </TableColumn>
                  <TableColumn>
                    {!testStep.inheritedFrom && (
                      <a onClick={() => handleRemoveTestStep(testStep)}>
                        Remove
                      </a>
                    )}
                  </TableColumn>
                </TableRow>
              )}
            />
          </CardBody>
          <CardFooter darker={true}>
            <TestStepInput onAdd={handleAddTestStep} />
          </CardFooter>
        </Card>

        <Button
          type="primary"
          loading={isLoading}
          disabled={!isFormValid()}
          onClick={handleCreateTestCase}
        >
          Create Test Case
        </Button>
      </PageContent>
    </Fragment>
  );
};

export default withRouter(TestCaseCreate);
