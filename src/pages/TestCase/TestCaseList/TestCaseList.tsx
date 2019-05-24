import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import Level from '@/components/Level';
import Table, { TableColumn, TableRow } from '@/components/Table';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { useFormInput } from '@/hooks/useFormInput';
import { Page } from '@/layouts/ProjectLayout';
import { TestCase } from '@/models';
import { Breadcrumb, Button, Icon } from 'antd';
import * as _ from 'lodash';
import React, { Fragment, useContext } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const TestCaseList: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { currentProject } = useContext(ProjectContext);
  const { testCases, isTestCasesFetched } = useContext(TestCaseContext);

  const {
    value: query,
    setValue: setQuery,
    handleChange: handleQueryChange,
  } = useFormInput('');

  const handleRowClick = (testCase: TestCase) => {
    history.push(`/projects/${currentProject!._id}/testcases/${testCase._id}`);
  };

  const filterTestCases = (_testCases: TestCase[], _query: string) =>
    _.filter(_testCases, (testCase: TestCase) =>
      testCase.title.toLowerCase().includes(_query.toLowerCase())
    );

  const resetQuery = () => setQuery('');

  return (
    <Page loading={!isTestCasesFetched}>
      <Card>
        <CardHeader>
          <h4 style={{ marginBottom: 16 }}>Test Cases</h4>
          <Level>
            <span>
              <Input
                onChange={handleQueryChange}
                placeholder="Filter"
                style={{ display: 'inline-block', width: 250 }}
                value={query}
              />
              {query && (
                <a onClick={resetQuery} style={{ marginLeft: 16 }}>
                  Reset
                </a>
              )}
            </span>

            <Button
              type="primary"
              onClick={() =>
                history.push(`/projects/${currentProject!._id}/testcases/new`)
              }
            >
              <Icon type="plus" /> New
            </Button>
          </Level>
        </CardHeader>
        <CardBody padded={false}>
          <Table
            data={filterTestCases(testCases, query)}
            columnTitles={['Title', 'Description']}
            renderRow={(testCase: TestCase, index: number) => (
              <TableRow key={index} onClick={() => handleRowClick(testCase)}>
                <TableColumn>{testCase.title}</TableColumn>
                <TableColumn>
                  {testCase.description || (
                    <span style={{ opacity: 0.4 }}>No Description</span>
                  )}
                </TableColumn>
              </TableRow>
            )}
          />
        </CardBody>
      </Card>
    </Page>
  );
};

export default withRouter(TestCaseList);
