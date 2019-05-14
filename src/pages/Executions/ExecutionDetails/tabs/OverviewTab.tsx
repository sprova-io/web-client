import { formatDuration } from '@/utils/formatDuration';
import { Card, Col, Progress, Row } from 'antd';
import Chart from 'chart.js';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Execution, ExecutionContext, ExecutionStatus } from 'sprova-types';
import '../ExecutionDetails.scss';

interface Props {
  executions: Execution[];
  context: ExecutionContext;
}

const OverviewTab: React.FunctionComponent<Props> = ({
  context,
  executions,
}) => {
  const pieChartCanvas = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const pieChart = new Chart(pieChartCanvas.current!, {
      type: 'doughnut',
      data: {
        labels: ['Success', 'Warning', 'Failure'],
        datasets: [
          {
            data: getExecutionResults(),
            backgroundColor: ['#52c41a', '#faad14', '#f5222d'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 16,
            padding: 16,
          },
        },
      },
    });
  }, [executions]);

  const getExecutionResults = (): [number, number, number] => {
    const countByStatus = (status: ExecutionStatus) => {
      return _.filter(executions, (execution) => execution.status === status)
        .length;
    };

    return [
      countByStatus(ExecutionStatus.Successful),
      countByStatus(ExecutionStatus.Warning),
      countByStatus(ExecutionStatus.Failed),
    ];
  };

  const getExecutionDuration = () => {
    const from = new Date(context!.createdAt);
    const to = new Date(context!.finishedAt!);
    return formatDuration(from, to);
  };

  const getExecutionProgess = () => {
    const successfulExecutions = _.filter(
      executions,
      (execution: Execution) => execution.status === ExecutionStatus.Successful
    );
    return Math.round((successfulExecutions.length / executions!.length) * 100);
  };

  const getProgressStatus = () => {
    const progress = getExecutionProgess();
    return progress < 50 ? 'exception' : progress < 90 ? 'normal' : 'success';
  };

  return (
    <Row gutter={24} type="flex">
      <Col
        span={6}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        <Card
          title="Total Number of Tests"
          style={{ marginBottom: 24, flexGrow: 1 }}
        >
          <span style={{ fontSize: 32 }}>{executions!.length}</span>
        </Card>
        <Card title="Execution Time" style={{ flexGrow: 1 }}>
          <span style={{ fontSize: 32 }}>{getExecutionDuration()}</span>
        </Card>
      </Col>

      <Col span={9}>
        <Card
          className="ratio-card"
          title="Success Ratio"
          style={{ height: '100%' }}
        >
          <Progress
            status={getProgressStatus()}
            format={(percent) => `${percent}%`}
            type="circle"
            percent={getExecutionProgess()}
          />
        </Card>
      </Col>
      <Col span={9}>
        <Card title="Test Results" style={{ height: '100%' }}>
          <canvas ref={pieChartCanvas} />
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewTab;
