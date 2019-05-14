import Card, { CardBody, CardFooter, CardHeader } from '@/components/Card';
import Level from '@/components/Level';
import List from '@/components/List';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { TestCase } from '@/models/TestCase';
import { findById } from '@/utils';
import { Button, Select } from 'antd';
import * as _ from 'lodash';
import React, { useContext, useState } from 'react';
import './TestCaseSelect.scss';

const Option = Select.Option;

interface TestCaseSelectProps {
  onRemoveTestCase: (testCase: TestCase) => void;
  onSelectTestCase: (testCase: TestCase) => void;
  selectedTestCases: TestCase[];
  style?: any;
}

const TestCaseSelect: React.FunctionComponent<TestCaseSelectProps> = ({
  onRemoveTestCase,
  onSelectTestCase,
  selectedTestCases,
  style,
}) => {
  const { testCases } = useContext(TestCaseContext);

  const [currentTestCaseId, setCurrentTestCaseId] = useState<
    string | undefined
  >();

  const handleTestCaseChange = (testCaseId: string) => {
    setCurrentTestCaseId(testCaseId);
  };

  const handleTestCaseSelect = () => {
    const testCase = findById(testCases, currentTestCaseId);
    setCurrentTestCaseId(undefined);

    if (testCase) {
      onSelectTestCase(testCase);
    }
  };

  const handleTestCaseRemove = (testCase: TestCase) => {
    onRemoveTestCase(testCase);
  };

  return (
    <Card style={{ ...style }}>
      <CardHeader>
        <h4>Select Test Cases</h4>
      </CardHeader>
      <CardBody padded={false}>
        <List
          data={selectedTestCases}
          empty="No Test Cases selected"
          renderItem={(testCase: TestCase) => (
            <Level>
              {testCase.title}
              <a onClick={() => handleTestCaseRemove(testCase)}>Remove</a>
            </Level>
          )}
          small={true}
          zebra={true}
        />
      </CardBody>
      <CardFooter darker={true}>
        <Level>
          <Select
            allowClear={true}
            showSearch={true}
            placeholder="None"
            onChange={handleTestCaseChange}
            optionFilterProp="children"
            style={{
              display: 'inline-block',
              marginRight: 16,
              width: '100%',
            }}
            value={currentTestCaseId}
          >
            {_.without(testCases, ...selectedTestCases).map(
              (testCase: TestCase, index: number) => (
                <Option key={index} value={testCase._id}>
                  {testCase.title}
                </Option>
              )
            )}
          </Select>
          <Button
            onClick={handleTestCaseSelect}
            disabled={!currentTestCaseId}
            style={{ width: 150 }}
            type="primary"
          >
            Add
          </Button>
        </Level>
      </CardFooter>
    </Card>
  );
};

export default TestCaseSelect;
