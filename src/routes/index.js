import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ChangePassword from '../pages/ChangePassword';
import Painel from '../pages/Painel';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/painel" component={Painel} isPrivate />
      <Route path="/changepassword" component={ChangePassword} />
    </Switch>
  );
}
