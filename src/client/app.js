import React from 'react';
import { object } from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import Routes from './routes';

const App = ({ history, store }) => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Routes history={history} />
      </Provider>
    </HelmetProvider>
  );
};

App.propTypes = {
  history: object.isRequired,
  store: object.isRequired,
};

export default App;
