import { Col, Row } from 'antd';
import React from 'react';
import { TestCase } from 'sprova-types';
import './OverviewTab.scss';

interface Props {
  testCase: TestCase;
  testCases: TestCase[];
}

const TestStepsTab: React.FunctionComponent<Props> = ({
  testCase,
  testCases,
}) => {
  return (
    <Row gutter={24}>
      <Col span={16} />
    </Row>
  );
};

export default TestStepsTab;
