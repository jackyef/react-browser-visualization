import Loadable from 'react-loadable';

export const NotHookView = Loadable({
  loader: () => import(/* webpackChunkName: "not-hook-view" */ './View'),
  loading: () => null,
});
