import PageLoad from '@/components/PageLoad';
import { CycleContext } from '@/contexts/CycleContext';
import { ProjectContext } from '@/contexts/ProjectContext';
import { TestCaseContext } from '@/contexts/TestCaseContext';
import Layout from '@/layouts/ProjectLayout';
import { Executions, TestCases } from '@/pages';
import { CycleCreate, CycleDetails, CyclesNotFound } from '@/pages/Cycles';
import { findById } from '@/utils';
import React, { useContext, useEffect } from 'react';
import Helmet from 'react-helmet';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import ProjectSettings from './ProjectSettings';

interface Params {
  pid: string;
}

const ProjectPage: React.FunctionComponent<RouteComponentProps<Params>> = ({
  history,
  match,
}) => {
  const {
    currentProject,
    isProjectsFetched,
    projects,
    onSelectProject,
  } = useContext(ProjectContext);
  const { currentCycle, isCyclesFetched } = useContext(CycleContext);
  const { isTestCasesFetched } = useContext(TestCaseContext);

  useEffect(() => {
    if (projects) {
      const project = findById(projects, match.params.pid);
      if (!project) {
        history.push('/projects');
        onSelectProject(null);
      }
    }
  }, [match.params.pid, projects]);

  return (
    <Layout>
      <Helmet>
        <title>{(currentProject && currentProject.title) || 'Project'}</title>
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
          <Route path="/projects/:pid/settings" component={ProjectSettings} />
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

export default withRouter(ProjectPage);
