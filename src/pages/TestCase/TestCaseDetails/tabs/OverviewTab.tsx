import { getTestCaseSteps, updateTestCase } from '@/api/testcase.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import { Label } from '@/components/Label';
import Level from '@/components/Level';
import List from '@/components/List';
import Table, { TableColumn, TableRow } from '@/components/Table';
import TextArea from '@/components/TextArea';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { TestCase } from '@/models/TestCase';
import { TestStep } from '@/models/TestStep';
import { findById, findChildren } from '@/utils';
import {
  Alert,
  Col,
  Icon,
  Row,
  Spin,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const Text = Typography.Text;

interface Params {
  pid: string;
  tid: string;
}

interface Props extends RouteComponentProps<Params> {
  testCase: TestCase;
  testCases: TestCase[];
}

const OverviewTab: React.FunctionComponent<Props> = ({
  history,
  match,
  testCase,
  testCases,
}) => {
  const {
    value: description,
    setValue: setDescription,
    handleChange: handleDescriptionChange,
  } = useFormTextArea(testCase.description);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState('');

  const [showInherited, setShowInherited] = useState(false);

  const [parent, setParent] = useState<TestCase | null>(null);
  const [children, setChildren] = useState<TestCase[]>([]);

  const [inheritedSteps, setInheritedSteps] = useState<TestStep[]>([]);
  const [isTestStepsLoading, setIsTestStepsLoading] = useState<boolean>(false);
  const [testStepsError, setTestStepsError] = useState<string | null>(null);

  const handleUpdateDescription = async () => {
    if (description === testCase.description) {
      setIsDescriptionEditable(false);
      return;
    }

    setIsDescriptionLoading(true);

    try {
      const ok = await updateTestCase({ ...testCase, description });
      if (!ok) {
        throw new Error('Response not ok');
      }
      testCase.description = description;
      setIsDescriptionEditable(false);
    } catch (error) {
      setDescriptionError(error);
      setTimeout(() => setDescriptionError(''), 3000);
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  const handleSelectTestCase = (_testCase: TestCase) => {
    setDescription(_testCase.description);
    setShowInherited(false);
    history.push(`/projects/${match.params.pid}/testcases/${_testCase._id}`);
  };

  const handleShowInheritedSwitch = () => {
    setShowInherited(!showInherited);
  };

  const descriptionActions = isDescriptionEditable ? (
    <span>
      <a onClick={handleUpdateDescription} style={{ marginRight: 8 }}>
        Save
      </a>
      <a
        onClick={() => {
          setIsDescriptionEditable(false);
          setDescription(testCase.description);
        }}
      >
        Cancel
      </a>
    </span>
  ) : (
    <a onClick={() => setIsDescriptionEditable(true)}>Edit</a>
  );

  useEffect(() => {
    const _parent = findById(testCases, testCase.parentId);
    setParent(_parent || null);
  }, [testCases, testCase.parentId, match.params.tid]);

  useEffect(() => {
    const _children = findChildren(testCases, match.params.tid);
    if (_children) {
      setChildren(_children);
    }
  }, [testCases, match.params.tid]);

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
    <Row gutter={24}>
      <Col span={6}>
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <h4>General Information</h4>
          </CardHeader>
          <CardBody>
            {descriptionError && (
              <Alert
                style={{ marginBottom: 16 }}
                message={descriptionError}
                type="error"
              />
            )}

            <Label text="Test Case ID" style={{ marginBottom: 16 }}>
              <Text copyable={true} ellipsis={false}>
                {(testCase && testCase._id) || 'Test Case ID'}
              </Text>
            </Label>

            <Label text="Created At" style={{ marginBottom: 16 }}>
              {(testCase && new Date(testCase.createdAt).toDateString()) ||
                'Date'}
            </Label>

            <Spin spinning={isDescriptionLoading}>
              <TextArea
                disabled={!isDescriptionEditable}
                empty="No Description"
                extra={descriptionActions}
                label="Description"
                onChange={handleDescriptionChange}
                placeholder="Description"
                value={description}
              />
            </Spin>
          </CardBody>
        </Card>

        {parent ? (
          <Card style={{ marginBottom: 24 }}>
            <CardHeader>
              <h4>Inherits From</h4>
            </CardHeader>
            <CardBody padded={false}>
              <List
                data={[parent]}
                onItemClick={handleSelectTestCase}
                renderItem={(_testCase: TestCase, index: number) =>
                  _testCase.title
                }
                small={true}
                zebra={true}
              />
            </CardBody>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <h4>Children</h4>
          </CardHeader>
          <CardBody padded={false}>
            <List
              data={children}
              onItemClick={handleSelectTestCase}
              renderItem={(_testCase: TestCase, index: number) =>
                _testCase.title
              }
              small={true}
              zebra={true}
            />
          </CardBody>
        </Card>
      </Col>

      <Col span={18}>
        <Card>
          <CardHeader>
            <Level>
              <h4>Test Steps</h4>
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
              data={[
                ...(showInherited ? inheritedSteps : []),
                ...testCase.steps,
              ]}
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
                    {!testStep.inheritedFrom && <a onClick={() => {}}>Edit</a>}
                  </TableColumn>
                </TableRow>
              )}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default withRouter(OverviewTab);
