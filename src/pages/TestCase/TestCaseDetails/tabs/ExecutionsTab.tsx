import { getExecutionsOfTestCase } from '@/api/execution.api';
import Card, { CardBody } from '@/components/Card';
import Table, { TableColumn, TableRow } from '@/components/Table';
import { useFetcher } from '@/hooks/useFetcher';
import { Icon, Spin } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Execution, ExecutionStatus } from 'sprova-types';

interface Params {
  pid: string;
  tid: string;
}

const ExecutionsTab: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
  match,
}) => {
  const { data: executions, isLoading } = useFetcher(
    getExecutionsOfTestCase,
    match.params.tid
  );

  const getStatusIcon = (status: ExecutionStatus): React.ReactNode => {
    switch (status) {
      case ExecutionStatus.Successful: {
        return (
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        );
      }
      case ExecutionStatus.Warning: {
        return <Icon type="warning" theme="twoTone" twoToneColor="goldenrod" />;
      }
      case ExecutionStatus.Failed: {
        return <Icon type="close-circle" theme="twoTone" twoToneColor="red" />;
      }
      case ExecutionStatus.Pending: {
        return <Icon type="loading" />;
      }
      default: {
        return null;
      }
    }
  };

  return isLoading || !executions ? (
    <Spin />
  ) : (
    <Card>
      <CardBody padded={false}>
        <Table
          columnTitles={['Status', 'ID', 'Date']}
          data={executions}
          renderRow={(execution: Execution, index: number) => {
            const icon = getStatusIcon(execution.status);
            return (
              <TableRow
                key={index}
                onClick={() => {
                  history.push(
                    `/projects/${match.params.pid}/executions/${
                      execution.contextId
                    }`
                  );
                }}
              >
                <TableColumn>
                  {icon && <span style={{ marginRight: 16 }}>{icon}</span>}
                </TableColumn>
                <TableColumn>{execution._id}</TableColumn>
                <TableColumn>
                  {new Date(execution.createdAt).toUTCString()}
                </TableColumn>
              </TableRow>
            );
          }}
        />
      </CardBody>
    </Card>
  );
};

export default withRouter(ExecutionsTab);
