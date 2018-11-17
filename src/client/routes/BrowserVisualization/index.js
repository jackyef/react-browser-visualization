import Loadable from 'react-loadable';

export const BrowserVisualizationView = Loadable({
  loader: () => import(/* webpackChunkName: "browser-visualization-view" */ './View'),
  loading: () => null,
});
