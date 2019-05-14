import PrivateRoute from '@/components/PrivateRoute';
import { UserProvider } from '@/contexts/UserContext';
import App from '@/core/App';
import { Login, Signup } from '@/pages';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './Root.scss';

const Root = () => {
  return (
    <Router>
      <UserProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="" component={App} />
        </Switch>
      </UserProvider>
    </Router>
  );
};

export default Root;
