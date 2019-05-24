import { postProject } from '@/api/project.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import Level from '@/components/Level';
import TextArea from '@/components/TextArea';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { Page } from '@/layouts/ProjectLayout';
import { Project } from '@/models';
import { Button, notification } from 'antd';
import React, { useContext, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const ProjectCreate: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { user } = useContext(UserContext);
  const { onAddProject } = useContext(ProjectContext);
  const {
    value: projectTitle,
    handleChange: handleProjectTitleChange,
  } = useFormInput('');
  const {
    value: description,
    handleChange: handleDescriptionChange,
  } = useFormTextArea('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleProjectSubmit = async () => {
    const projectNew: Partial<Project> = {
      title: projectTitle,
      description: '',
      userId: user!._id,
    };

    setIsLoading(true);

    try {
      const project = await postProject(projectNew);
      setIsLoading(false);
      onAddProject(project);
      notification.success({
        placement: 'bottomRight',
        message: `${project.title} created`,
        description: `Project created with ID ${project._id}`,
      });
      history.push(`/projects/${project._id}`);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to create project',
        description: error,
      });
    }
  };

  return (
    <Page subTitle="" title="Create New Project">
      <Helmet>
        <title>New Project</title>
      </Helmet>
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <Level>
            <h4>General Information</h4>
          </Level>
        </CardHeader>
        <CardBody darker={true}>
          <Input
            label="Title"
            onChange={handleProjectTitleChange}
            placeholder="Project Title"
            required={true}
            style={{ marginBottom: 24 }}
            value={projectTitle}
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
        disabled={!projectTitle}
        onClick={handleProjectSubmit}
      >
        Create Project
      </Button>
    </Page>
  );
};

export default withRouter(ProjectCreate);
