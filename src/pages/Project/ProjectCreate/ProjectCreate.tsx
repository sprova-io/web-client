import { postProject } from '@/api/project.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import TextArea from '@/components/TextArea';
import { ProjectContext } from '@/contexts/ProjectContext';
import { UserContext } from '@/contexts/UserContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { Breadcrumb, Button, notification } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import Helmet from 'react-helmet';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Project } from 'sprova-types';

const ProjectCreate: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { user } = useContext(UserContext);
  const { onAddProject, onSelectProject } = useContext(ProjectContext);
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
      onAddProject(project);
      onSelectProject(project);
      notification.success({
        placement: 'bottomRight',
        message: `${project.title} created`,
        description: `Project created with ID ${project._id}`,
      });
      history.push(`/projects/${project._id}`);
    } catch (error) {
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to create project',
        description: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>Sprova | Create Project</title>
      </Helmet>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects`}>
              <Breadcrumb.Item>Projects</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>New</Breadcrumb.Item>
          </Breadcrumb>
        }
        title="Create Project"
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
      </PageContent>
    </Fragment>
  );
};

export default withRouter(ProjectCreate);
