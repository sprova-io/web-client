import { CycleProvider } from '@/contexts/CycleContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { TestCaseProvider } from '@/contexts/TestCaseContext';
import { Project, ProjectCreate, ProjectList } from '@/pages';
import PageNotFound from '@/pages/PageNotFound';
import Settings from '@/pages/Settings';
import UserPage from '@/pages/User';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const App = () => {
  return (
    <ProjectProvider>
      <CycleProvider>
        <TestCaseProvider>
          <Switch>
            <Route path="/projects" exact={true} component={ProjectList} />
            <Route path="/projects/new" component={ProjectCreate} />
            <Route path="/projects/:pid" component={Project} />
            <Route path="/users/:uid" component={UserPage} />
            <Route path="/settings" component={Settings} />
            <Redirect path="/" exact={true} to="/projects" />
            <Route path="" component={PageNotFound} />
          </Switch>
        </TestCaseProvider>
      </CycleProvider>
    </ProjectProvider>
  );
};

export default App;
