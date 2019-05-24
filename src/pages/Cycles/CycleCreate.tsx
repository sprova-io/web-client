import { postCycle } from '@/api/cycle.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import Level from '@/components/Level';
import TextArea from '@/components/TextArea';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { Page } from '@/layouts/ProjectLayout';
import { Cycle } from '@/models';
import { Button, notification } from 'antd';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const CycleCreate: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { currentProject } = useContext(ProjectContext);
  const { onAddCycle, onSelectCycle } = useContext(CycleContext);

  const {
    value: cycleTitle,
    handleChange: handleCycleTitleChange,
  } = useFormInput('');
  const {
    value: description,
    handleChange: handleDescriptionChange,
  } = useFormTextArea('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCycleSubmit = async () => {
    const cycleNew: Partial<Cycle> = {
      title: cycleTitle,
      description: '',
      projectId: currentProject!._id,
    };

    setIsLoading(true);

    try {
      const cycle = await postCycle(cycleNew);
      setIsLoading(false);
      onAddCycle(cycle);
      onSelectCycle(cycle);
      notification.success({
        placement: 'bottomRight',
        message: `${cycle.title} created`,
        description: `Cycle created with ID ${cycle._id}`,
      });
      history.push(`/projects/${currentProject!._id}`);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to create cycle',
        description: error,
      });
    }
  };

  return (
    <Page subTitle="" title="Create New Cycle">
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <Level>
            <h4>General Information</h4>
          </Level>
        </CardHeader>
        <CardBody darker={true}>
          <Input
            label="Title"
            onChange={handleCycleTitleChange}
            placeholder="Cycle Name"
            required={true}
            style={{ marginBottom: 24 }}
            value={cycleTitle}
          />
          <TextArea
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Description"
          />
        </CardBody>
      </Card>
      <Button
        type="primary"
        loading={isLoading}
        disabled={!cycleTitle}
        onClick={handleCycleSubmit}
      >
        Create Cycle
      </Button>
    </Page>
  );
};

export default withRouter(CycleCreate);
