import { deleteTestCase } from '@/api/testcase.api';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { Page } from '@/layouts/ProjectLayout';
import { TestCase } from '@/models';
import { findById } from '@/utils';
import { Button, Icon, notification, Popconfirm, Tabs } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import CodeGenerationTab from './tabs/CodeGenerationTab';
import ExecutionsTab from './tabs/ExecutionsTab';
import OverviewTab from './tabs/OverviewTab';

const TabPane = Tabs.TabPane;

interface Params {
  pid: string;
  tid: string;
}

const TestCaseDetails: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
  match,
}) => {
  const { currentProject } = useContext(ProjectContext);
  const { testCases, onRemoveTestCase } = useContext(TestCaseContext);

  const [activeTabKey, setActiveTabKey] = useState('overview');
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [testCase, setTestCase] = useState<TestCase | null>(null);

  const handleDeleteTestCase = async () => {
    setIsDeleteLoading(true);

    try {
      await deleteTestCase(match.params.tid);
      onRemoveTestCase(testCase!);
      notification.success({
        placement: 'bottomRight',
        message: `${testCase!.title} deleted`,
      });
      history.push(`/projects/${match.params.pid}/testcases`);
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to delete test case',
        description: error,
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const executeButton = (
    <Link
      key="execute"
      to={{
        pathname: `/projects/${match.params.pid}/executions/setup`,
        search: `?type=testcases&tid=${match.params.tid}`,
      }}
      style={{ marginRight: 16 }}
    >
      <Button type="primary">Execute</Button>
    </Link>
  );

  useEffect(() => {
    const _testCase = findById(testCases, match.params.tid);

    if (!_testCase) {
      notification.error({
        placement: 'bottomRight',
        message: 'Oops',
        description: `No Test Case found with ID ${match.params.tid}`,
      });
      history.push(`/projects/${match.params.pid}/testcases`);
      return;
    }

    setTestCase(_testCase);
  }, [match.params.tid]);

  const deleteButton = (
    <Popconfirm
      key="delete"
      placement="bottomRight"
      title="Delete this test case?"
      onConfirm={handleDeleteTestCase}
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      okText="Yes"
      cancelText="Cancel"
    >
      <Button type="danger" loading={isDeleteLoading}>
        Delete
      </Button>
    </Popconfirm>
  );

  // <PageHeader
  //       breadcrumb={
  //         <Breadcrumb>
  //           <Link to={`/projects/${match.params.pid}`}>
  //             <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
  //           </Link>
  //           <Link to={`/projects/${match.params.pid}/testcases`}>
  //             <Breadcrumb.Item>Test Cases</Breadcrumb.Item>
  //           </Link>
  //           <Breadcrumb.Item>Test Case</Breadcrumb.Item>
  //         </Breadcrumb>
  //       }
  //       title={(testCase && testCase.title) || 'Test Case Title'}
  //       extra={[executeButton, deleteButton]}
  //       tabs={
  //         <Tabs
  //           defaultActiveKey={`${activeTabKey}`}
  //           onChange={(activeKey: string) => setActiveTabKey(activeKey)}
  //         >
  //           <TabPane tab="Overview" key="overview" />
  //           <TabPane tab="Executions" key="executions" />
  //           <TabPane tab="Code Generation" key="codeGeneration" />
  //         </Tabs>
  //       }
  //     />

  return (
    <Page loading={!testCase}>
      {activeTabKey === 'overview' ? (
        <OverviewTab testCase={testCase!} testCases={testCases} />
      ) : activeTabKey === 'executions' ? (
        <ExecutionsTab />
      ) : activeTabKey === 'codeGeneration' ? (
        <CodeGenerationTab testCase={testCase!} />
      ) : null}
    </Page>
  );
};

export default withRouter(TestCaseDetails);
