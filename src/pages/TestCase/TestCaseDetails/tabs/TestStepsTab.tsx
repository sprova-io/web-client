import { TestCase } from '@/models/TestCase';
import { TestStep } from '@/models/TestStep';
import { findById, resolveInheritance } from '@/utils';
import { Button, Col, List, Row, Tag } from 'antd';
import React, { useState } from 'react';
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
