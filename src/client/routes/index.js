import React from 'react';
import { object } from 'prop-types';
import { Router, Route, Switch } from 'react-router';

import { AboutView } from './About';
import { HomeView } from './Home';
import { HookView } from './Hook';

const RouterProvider = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route path="/hook" component={HookView} />
        <Route path="/about" component={AboutView} />
      </Switch>
    </Router>
  );
};

RouterProvider.propTypes = {
  history: object.isRequired,
};

export default RouterProvider;
