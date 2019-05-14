import { postCycle } from '@/api/cycle.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import TextArea from '@/components/TextArea';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { Breadcrumb, Button, notification } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Cycle } from 'sprova-types';

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
      onAddCycle(cycle);
      onSelectCycle(cycle);
      notification.success({
        placement: 'bottomRight',
        message: `${cycle.title} created`,
        description: `Cycle created with ID ${cycle._id}`,
      });
      history.push(`/projects/${currentProject!._id}`);
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to create cycle',
        description: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${currentProject!._id}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Link to={`/projects/${currentProject!._id}/testcases`}>
              <Breadcrumb.Item>Cycles</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>New</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Create Cycle"
      />
      <PageContent>
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
      </PageContent>
    </Fragment>
  );
};

export default withRouter(CycleCreate);
