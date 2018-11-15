import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

import App from './app';
import createReduxStore from './redux';
import './WebWorker';

const history = createBrowserHistory();
const store = createReduxStore(history);

const notifyBrowserPainted = () => {
  requestAnimationFrame(() => {
    console.log('browser painted');
    notifyBrowserPainted();
  });
}

setInterval(() => console.log('1 second passed...'), 1000);
notifyBrowserPainted();

ReactDOM.render(<App history={history} store={store} />, document.getElementById('root'));
