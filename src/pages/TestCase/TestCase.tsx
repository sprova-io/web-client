import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './TestCase.scss';
import TestCaseCreate from './TestCaseCreate';
import TestCaseDetails from './TestCaseDetails';
import TestCaseList from './TestCaseList';

const TestCase: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route
        path={'/projects/:pid/testcases'}
        exact={true}
        component={TestCaseList}
      />
      <Route path={'/projects/:pid/testcases/new'} component={TestCaseCreate} />
      <Route
        path={'/projects/:pid/testcases/:tid'}
        component={TestCaseDetails}
      />
    </Switch>
  );
};

export default TestCase;
