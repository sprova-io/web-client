import { deleteProject, updateProject } from '@/api/project.api';
import Card, { CardBody, CardHeader } from '@/components/Card';
import Input from '@/components/Input';
import { Label } from '@/components/Label';
import Level from '@/components/Level';
import TextArea from '@/components/TextArea';
import { ProjectContext } from '@/contexts/ProjectContext';
import { useFormInput } from '@/hooks/useFormInput';
import { useFormTextArea } from '@/hooks/useFormTextArea';
import { Page } from '@/layouts/ProjectLayout';
import { Project } from '@/models';
import { Button, Icon, notification, Popconfirm, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const { Text } = Typography;

const ProjectSettings: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { currentProject, onRemoveProject } = useContext(ProjectContext);

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

  const handleDeleteProject = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteProject(currentProject!._id);
      setIsDeleteLoading(false);
      onRemoveProject(currentProject!);
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

  return (
    <Page subTitle={currentProject!.title} title="Project Settings">
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
        style={{ marginRight: 16 }}
      >
        Save
      </Button>
      <Popconfirm
        placement="bottomLeft"
        title="Delete this project?"
        onConfirm={handleDeleteProject}
        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        okText="Yes"
        cancelText="Cancel"
      >
        <Button type="danger" loading={isDeleteLoading}>
          Delete
        </Button>
      </Popconfirm>
    </Page>
  );
};

export default withRouter(ProjectSettings);
