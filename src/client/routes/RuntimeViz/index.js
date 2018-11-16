import Loadable from 'react-loadable';

export const RuntimeVizView = Loadable({
  loader: () => import(/* webpackChunkName: "runtime-view" */ './View'),
  loading: () => null,
});
