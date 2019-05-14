import { deleteProject, updateProject } from '@/api/project.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import { PageContent, PageHeader } from '@/components/Layout';
import Level from '@/components/Level';
import { ProjectContext } from '@/contexts/ProjectContext';
import {
  Breadcrumb,
  Button,
  Icon,
  notification,
  Popconfirm,
  Typography,
} from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import {
  Link,
  Redirect,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { Project } from 'sprova-types';

import Input from '@/components/Input';
import { Label } from '@/components/Label';
import TextArea from '@/components/TextArea';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';

const { Text } = Typography;

const ProjectSettings: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { currentProject } = useContext(ProjectContext);

  const {
    value: projectTitle,
    handleChange: handleProjectTitleChange,
  } = useFormInput(currentProject!.title);
  const {
    value: description,
    handleChange: handleDescriptionChange,
  } = useFormTextArea(currentProject!.description);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const deleteRequest = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteProject(currentProject!._id);
      setIsDeleteLoading(false);
      notification.success({
        placement: 'bottomRight',
        message: `${currentProject!.title} deleted`,
      });
      history.push('/projects');
    } catch (error) {
      setIsDeleteLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to delete project',
        description: error,
      });
    }
  };

  const handleSubmit = async () => {
    const projectNew: Project = {
      ...currentProject!,
      title: projectTitle,
      description,
    };

    setIsLoading(true);

    try {
      await updateProject(projectNew);
      setIsLoading(false);
      notification.success({
        placement: 'bottomRight',
        message: 'Project updated',
      });
      history.push(`/projects/${currentProject!._id}`);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        placement: 'bottomRight',
        message: 'Failed to update project',
        description: error,
      });
    }
  };

  const deleteButton = (
    <Popconfirm
      placement="bottomRight"
      title="Delete this project?"
      onConfirm={deleteRequest}
      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
      okText="Yes"
      cancelText="Cancel"
    >
      <Button type="danger" loading={isDeleteLoading}>
        Delete
      </Button>
    </Popconfirm>
  );

  return (
    <Fragment>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <Link to={`/projects/${currentProject!._id}`}>
              <Breadcrumb.Item>{currentProject!.title}</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Settings</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={deleteButton}
        title="Edit the Project"
      />
      <PageContent>
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <Level>
              <h4>General Information</h4>
            </Level>
          </CardHeader>
          <CardBody darker={true}>
            <Label text="Project ID" style={{ marginBottom: 24 }}>
              <Text copyable={true} ellipsis={false}>
                {currentProject!._id}
              </Text>
            </Label>
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
          onClick={handleSubmit}
        >
          Save
        </Button>
      </PageContent>
    </Fragment>
  );
};

export default withRouter(ProjectSettings);
