import Loadable from 'react-loadable';

export const HookView = Loadable({
  loader: () => import(/* webpackChunkName: "hook-view" */ './View'),
  loading: () => null,
});
