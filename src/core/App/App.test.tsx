import PrivateRoute from '@/components/PrivateRoute';
import { Login } from '@/pages';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="" component={App} />
      </Switch>
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
