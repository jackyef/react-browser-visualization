import React from 'react';
import styled from 'react-emotion';
import { object } from 'prop-types';
import { Router, Route, Switch } from 'react-router';

import { AboutView } from './About';
import { HomeView } from './Home';
import { HookView } from './Hook';
import { NotHookView } from './NotHook';
import { RuntimeVizView } from './RuntimeViz';
import ClockContainer from '../components/Clock/Container';

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  flex-direction: row;
`;

const MainContent = styled.div`
  flex: 1;
`;

const RouterProvider = ({ history }) => {
  return (
    <Router history={history}>
      <AppContainer>
        <MainContent>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route path="/hook" component={HookView} />
            <Route path="/not-hook" component={NotHookView} />
            <Route path="/runtime-viz" component={RuntimeVizView} />
            <Route path="/about" component={AboutView} />
          </Switch>
        </MainContent>
        <ClockContainer />
      </AppContainer>
    </Router>
  );
};

RouterProvider.propTypes = {
  history: object.isRequired,
};

export default RouterProvider;
