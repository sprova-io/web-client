import { Layout, PageLoad } from '@/components/Layout';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import { Executions, TestCases } from '@/pages';
import { CycleCreate, CycleDetails, CyclesNotFound } from '@/pages/Cycles';
import React, { useContext } from 'react';
import Helmet from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProjectSettings from './ProjectSettings';

const ProjectPage: React.FunctionComponent = () => {
  const { currentProject, isProjectsFetched } = useContext(ProjectContext);
  const { currentCycle, isCyclesFetched } = useContext(CycleContext);
  const { isTestCasesFetched } = useContext(TestCaseContext);

  return (
    <Layout>
      <Helmet>
        <title>
          Sprova | {(currentProject && currentProject.title) || 'Project'}
        </title>
      </Helmet>
      {!(isProjectsFetched && isCyclesFetched) ? (
        <PageLoad />
      ) : !currentProject ? (
        <Redirect to="/projects" />
      ) : !currentCycle ? (
        <Switch>
          <Route path="/projects/:pid/cycles/new" component={CycleCreate} />
          <Route
            path="/projects/:pid"
            exact={true}
            component={CyclesNotFound}
          />
          <Redirect to={`/projects/${currentProject._id}`} />
        </Switch>
      ) : !isTestCasesFetched ? (
        <PageLoad />
      ) : (
        <Switch>
          <Route path="/projects/:pid" exact={true} component={CycleDetails} />
          <Route path="/projects/:pid/cycles/new" component={CycleCreate} />
          <Route path="/projects/:pid/executions" component={Executions} />
          <Route path="/projects/:pid/settings" component={ProjectSettings} />
          <Route path="/projects/:pid/testcases" component={TestCases} />
        </Switch>
      )}
    </Layout>
  );
};

export default ProjectPage;
