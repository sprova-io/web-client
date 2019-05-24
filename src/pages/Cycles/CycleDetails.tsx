import Card, { CardBody, CardHeader } from '@/components/Card';
import { Label } from '@/components/Label';
import Level from '@/components/Level';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { Page } from '@/layouts/ProjectLayout';
import { Col, Row, Typography } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const Text = Typography.Text;

const CycleDetails: React.FunctionComponent = () => {
  const { currentProject } = useContext(ProjectContext);
  const { currentCycle } = useContext(CycleContext);

  return (
    <Page subTitle={currentCycle!.title} title={currentProject!.title}>
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <CardHeader>
              <h4>Cycle Information</h4>
            </CardHeader>
            <CardBody>
              <Label text="Cycle ID" style={{ marginBottom: 16 }}>
                <Text copyable={true} ellipsis={false}>
                  {(currentCycle && currentCycle._id) || 'Cycle ID'}
                </Text>
              </Label>

              <Label text="Created At">
                {(currentCycle &&
                  new Date(currentCycle.createdAt).toDateString()) ||
                  'Date'}
              </Label>
            </CardBody>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <CardHeader>
              <Level>
                <h4>Recent Executions</h4>
                <Link to={`/projects/${currentProject!._id}/executions`}>
                  Show All
                </Link>
              </Level>
            </CardHeader>
            <CardBody>Please implement this awesome feature</CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
};

export default CycleDetails;
