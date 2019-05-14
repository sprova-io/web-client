import Input from '@/components/Input';
import { useFormInput } from '@/hooks/useFormInput';
import { Button, Col, Row } from 'antd';
import React, { useRef } from 'react';
import { TestStep } from 'sprova-types';
import './TestCaseCreate.scss';

interface TestStepInputProps {
  onAdd: (testStep: TestStep) => void;
}

const TestStepInput: React.FunctionComponent<TestStepInputProps> = ({
  onAdd,
}) => {
  const actionInputRef = useRef<HTMLInputElement>(null);

  const {
    value: action,
    setValue: setAction,
    handleChange: handleActionChange,
  } = useFormInput('');
  const {
    value: expected,
    setValue: setExpected,
    handleChange: handleExpectedChange,
  } = useFormInput('');

  const handleAddTestStep = () => {
    if (!isFormValid()) {
      return;
    }

    const testStep = {
      action,
      expected,
    };

    onAdd(testStep);
    setAction('');
    setExpected('');

    if (actionInputRef && actionInputRef.current) {
      actionInputRef.current.focus();
    }
  };

  const isFormValid = () => action && action.length > 0;

  return (
    <Row gutter={16}>
      <Col span={10}>
        <Input
          onChange={handleActionChange}
          onEnter={handleAddTestStep}
          placeholder="Step action"
          ref={actionInputRef}
          value={action}
        />
      </Col>
      <Col span={10}>
        <Input
          value={expected}
          onChange={handleExpectedChange}
          onEnter={handleAddTestStep}
          placeholder="Expected"
        />
      </Col>
      <Col span={4}>
        <Button
          block={true}
          type="primary"
          disabled={!isFormValid()}
          onClick={handleAddTestStep}
        >
          Add
        </Button>
      </Col>
    </Row>
  );
};

export default TestStepInput;
