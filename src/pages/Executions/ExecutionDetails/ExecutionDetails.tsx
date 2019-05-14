import { getExecutionContext } from '@/api/execution-context.api';
import { getExecutionsOfContext } from '@/api/execution.api';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFetcher } from '@/hooks/useFetcher';
import { Breadcrumb, Button, Col, Icon, Row, Spin, Tabs, Tooltip } from 'antd';
import _ from 'lodash';
import React, { Fragment, useContext, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './ExecutionDetails.scss';
import OverviewTab from './tabs/OverviewTab';
import TestCasesTab from './tabs/TestCasesTab';

const TabPane = Tabs.TabPane;

interface Params {
  pid: string;
  ecid: string;
}

const ExecutionResult: React.FunctionComponent<RouteComponentProps<Params>> = ({
  match,
}) => {
  const { currentProject } = useContext(ProjectContext);

  const [activeTabKey, setActiveTabKey] = useState('overview');

  const {
    data: executionContext,
    isLoading: isExecutionContextLoading,
  } = useFetcher(getExecutionContext, match.params.ecid);

  const { data: executions, isLoading: isExecutionsLoading } = useFetcher(
    getExecutionsOfContext,
    match.params.ecid,
    true
  );

  const generatePdfButton = (
    <Tooltip title="Generate PDF Report" key="generatePdf">
      <Button style={{ marginRight: 16 }}>
        <Icon type="file-pdf" />
      </Button>
    </Tooltip>
  );

  const rerunButton = (
    <Link to="/" key="rerun">
      <Button type="primary">Re-run Tests</Button>
    </Link>
  );

  let content;

  switch (activeTabKey) {
    case 'overview': {
      content = (
        <OverviewTab context={executionContext!} executions={executions!} />
      );
      break;
    }
    case 'testCases': {
      content = <TestCasesTab executions={executions!} />;
      break;
    }
  }

  return isExecutionContextLoading || isExecutionsLoading ? (
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
            <Breadcrumb.Item>Result</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Finished Execution"
        extra={[generatePdfButton, rerunButton]}
        tabs={
          <Tabs
            defaultActiveKey={`${activeTabKey}`}
            onChange={(activeKey: string) => setActiveTabKey(activeKey)}
          >
            <TabPane tab="Overview" key="overview" />
            <TabPane tab="Test Cases" key="testCases" />
          </Tabs>
        }
      >
        <Row type="flex" justify="space-between">
          <Col span={8}>
            <Level>
              <Col>
                <div>
                  <strong>Created at:</strong>
                </div>
                <div>
                  <strong>Mode:</strong>
                </div>
                <div>
                  <strong>Target:</strong>
                </div>
                <div>
                  <strong>User:</strong>
                </div>
              </Col>
              <Col>
                <div>
                  {new Date(executionContext!.createdAt).toLocaleString()}
                </div>
                <div>
                  {_.upperFirst(executionContext!.method.toLowerCase())}
                </div>
                <div>{_.upperFirst(executionContext!.type.toLowerCase())}</div>
                <div>{executionContext!.userId}</div>
              </Col>
            </Level>
          </Col>
          <Col style={{ textAlign: 'end' }} />
        </Row>
      </PageHeader>
      <PageContent>{content}</PageContent>
    </Fragment>
  );
};

export default ExecutionResult;
